import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authStore } from '@/lib/apiServerClient';
import { getUserSubscriptions } from '@/api/InternalEcommerceSubscriptionsApi';

const SubscriptionAuthContext = createContext(null);

export function SubscriptionAuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(() =>
		authStore.isValid ? authStore.model : null,
	);
	const [subscriptions, setSubscriptions] = useState([]);

	const fetchSubscriptionsRef = useRef(null);
	fetchSubscriptionsRef.current = async () => {
		if (!authStore.isValid) {
			setSubscriptions([]);
			return [];
		}
		try {
			const res = await getUserSubscriptions();
			const list = res?.subscriptions ?? [];
			setSubscriptions(list);
			return list;
		} catch (err) {
			console.error('Failed to fetch subscriptions:', err);
			setSubscriptions([]);
			return [];
		}
	};

	useEffect(() => {
		if (authStore.isValid) {
			fetchSubscriptionsRef.current();
		}
		const unsubscribe = authStore.onChange(() => {
			setCurrentUser(authStore.isValid ? authStore.model : null);
			if (authStore.isValid) {
				fetchSubscriptionsRef.current();
			} else {
				setSubscriptions([]);
			}
		});
		return () => unsubscribe();
	}, []);

	const hasActiveSubscription = subscriptions.some(
		(s) => s && (s.status === 'active' || s.status === 'trialing'),
	);
	const [postCheckoutPending, setPostCheckoutPending] = useState(
		() =>
			typeof window !== 'undefined' &&
			sessionStorage.getItem('subscriptionPending') !== null,
	);
	const [pollingExhausted, setPollingExhausted] = useState(false);

	useEffect(() => {
		if (!postCheckoutPending) return undefined;
		if (hasActiveSubscription) {
			sessionStorage.removeItem('subscriptionPending');
			setPostCheckoutPending(false);
			return undefined;
		}
		let attempts = 0;
		const maxAttempts = 15;
		fetchSubscriptionsRef.current();
		const handle = setInterval(() => {
			attempts += 1;
			if (attempts >= maxAttempts) {
				clearInterval(handle);
				sessionStorage.removeItem('subscriptionPending');
				setPostCheckoutPending(false);
				setPollingExhausted(true);
				return;
			}
			fetchSubscriptionsRef.current();
		}, 2000);
		return () => clearInterval(handle);
	}, [postCheckoutPending, hasActiveSubscription]);

	const polling = postCheckoutPending && !hasActiveSubscription;
	const refreshSubscriptions = () => fetchSubscriptionsRef.current();
	const isAuthenticated = Boolean(currentUser);

	const value = {
		currentUser,
		isAuthenticated,
		subscriptions,
		refreshSubscriptions,
		polling,
		pollingExhausted,
	};

	return (
		<SubscriptionAuthContext.Provider value={value}>
			{children}
		</SubscriptionAuthContext.Provider>
	);
}

export function useSubscriptionAuth() {
	const context = useContext(SubscriptionAuthContext);
	if (!context) {
		throw new Error(
			'useSubscriptionAuth must be used within <SubscriptionAuthProvider>',
		);
	}
	return context;
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { LOGIN_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';
import { Button } from '@/components/ui/button';

export default function SubscribeButton({ plan, variant, className, label }) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const { currentUser, isAuthenticated, refreshSubscriptions } = useSubscriptionAuth();
	const navigate = useNavigate();
	const { t } = useLanguage();

	const handleClick = async () => {
		if (!isAuthenticated) {
			navigate(LOGIN_PATH);
			return;
		}
		setErrorMessage(null);
		setLoading(true);
		try {
			const { url } = await initializeCheckout({
				items: [{ variant_id: variant.id, quantity: 1 }],
				successUrl: window.location.origin + MANAGE_PATH + '?just_subscribed=1',
				cancelUrl: window.location.origin + MANAGE_PATH + '?just_subscribed=1',
				customer: {
					external_id: currentUser.id,
					email: currentUser.email,
				},
			});
			sessionStorage.setItem('subscriptionPending', String(Date.now()));
			window.location = url;
		} catch (err) {
			console.error('Checkout failed', err);
			setLoading(false);
			const freshSubscriptions = await refreshSubscriptions();
			const hasActive = freshSubscriptions.some(
				(subscription) => subscription && (subscription.status === 'active' || subscription.status === 'trialing'),
			);
			if (hasActive) {
				navigate(MANAGE_PATH);
			} else {
				setErrorMessage(t('subs.checkoutError'));
			}
		}
	};

	return (
		<div className="w-full">
			<Button
				type="button"
				onClick={handleClick}
				disabled={loading}
				variant={plan?.highlight ? 'default' : 'outline'}
				className={className ?? 'w-full font-semibold font-sans h-12 text-base'}
			>
				{loading ? t('subs.redirecting') : (label ?? t('subs.subscribeTo', { plan: plan?.title ?? 'plan' }))}
			</Button>
			{errorMessage && (
				<p className="text-sm text-destructive mt-2 text-center" role="alert">{errorMessage}</p>
			)}
		</div>
	);
}
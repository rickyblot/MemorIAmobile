import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { getManageSubscriptionUrl } from '@/api/InternalEcommerceSubscriptionsApi';
import { activeSubscription } from '@/lib/ecommerceSubscriptionsUtils';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ManageSubscriptionButton({ className, plansPath = PLANS_PATH }) {
	const [loading, setLoading] = useState(false);
	const { subscriptions, isAuthenticated } = useSubscriptionAuth();
	const navigate = useNavigate();
	const { t } = useLanguage();
	const { toast } = useToast();

	if (!isAuthenticated) return null;

	const active = activeSubscription(subscriptions);

	if (!active) {
		return (
			<Button
				type="button"
				variant="outline"
				onClick={() => navigate(plansPath)}
				className={className ?? 'w-full sm:w-auto font-semibold font-sans'}
			>
				{t('subs.viewPlans') || 'View plans'}
			</Button>
		);
	}

	const handleClick = async () => {
		setLoading(true);
		try {
			const { url } = await getManageSubscriptionUrl({
				subscriptionId: active.id,
				returnUrl: window.location.href,
			});
			if (url) {
				window.open(url, '_blank');
			}
		} catch (error) {
			console.error('Failed to open manage portal', error);
			let errorMessage = error.message;

			if (error.code === 'STRIPE_NOT_CONFIGURED' || errorMessage.includes('Test subscriptions')) {
				errorMessage = t('subs.testModeError') || 'Your subscription is in test mode. To manage your subscription, please purchase with a real payment method.';
			}

			toast({
				title: t('common.error') || 'Error',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant="secondary"
			onClick={handleClick}
			disabled={loading}
			className={className ?? 'w-full sm:w-auto font-semibold font-sans'}
		>
			{loading ? (t('subs.redirecting') || 'Redirecting...') : (t('subs.manage') || 'Manage Subscription')}
		</Button>
	);
}
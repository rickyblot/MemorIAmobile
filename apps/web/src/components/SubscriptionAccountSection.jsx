import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { activeSubscription } from '@/lib/ecommerceSubscriptionsUtils';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Button } from '@/components/ui/button';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';
import ManageSubscriptionButton from './ManageSubscriptionButton.jsx';

export default function SubscriptionAccountSection({ className }) {
	const { isAuthenticated, subscriptions, polling, pollingExhausted } = useSubscriptionAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();

	if (!isAuthenticated) return null;

	const active = activeSubscription(subscriptions);
	const wrapper = className ?? 'rounded-xl border border-border bg-card p-6 shadow-sm';

	if (polling) {
		return (
			<section className={wrapper}>
				<div className="flex items-center gap-3 mb-2">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<h2 className="text-lg font-semibold text-foreground">{t('subs.activating') || 'Activating your subscription...'}</h2>
				</div>
				<p className="text-muted-foreground">
					{t('subs.holdOn') || 'Hold on while we finalize your payment. This usually takes a few seconds.'}
				</p>
			</section>
		);
	}

	if (pollingExhausted && !active) {
		return (
			<section className={wrapper}>
				<h2 className="text-lg font-semibold mb-2 text-foreground">{t('subs.almostThere') || 'Almost there'}</h2>
				<p className="text-muted-foreground mb-4">
					{t('subs.processing') || 'Your payment is being processed. Refresh in a moment to see your subscription.'}
				</p>
				<Button onClick={() => navigate(PLANS_PATH)} variant="outline" className="font-semibold border-primary/50 hover:bg-primary hover:text-primary-foreground">
					{t('subs.viewPlans') || 'View plans'}
				</Button>
			</section>
		);
	}

	if (!active) {
		return (
			<section className={wrapper}>
				<h2 className="text-lg font-semibold mb-2 text-foreground">{t('subs.noSubTitle') || 'Subscription'}</h2>
				<p className="text-muted-foreground mb-4">
					{t('subs.noSubDesc') || "You don't have an active subscription. Unlock premium features with a paid plan."}
				</p>
				<Button onClick={() => navigate(PLANS_PATH)} variant="outline" className="font-semibold border-primary/50 hover:bg-primary hover:text-primary-foreground">
					{t('subs.viewPlans') || 'View plans'}
				</Button>
			</section>
		);
	}

	const statusLabel = active.status === 'trialing' ? (t('subs.trialing') || 'Trialing') : (t('subs.active') || 'Active');

	return (
		<section className={wrapper}>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
						{t('subs.noSubTitle') || 'Subscription'}
					</h2>
					<p className="text-2xl font-bold text-foreground font-sans">{active.product_title}</p>
				</div>
				<div className="self-start sm:self-center">
					<span className="inline-flex items-center rounded-full gradient-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
						{statusLabel}
					</span>
				</div>
			</div>
			
			<ManageSubscriptionButton />
		</section>
	);
}
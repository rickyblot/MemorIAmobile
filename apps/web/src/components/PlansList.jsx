import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { useEcommerceSubscriptionsPlans } from '@/hooks/useEcommerceSubscriptionsPlans';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import SubscribeButton from './SubscribeButton.jsx';
import ManageSubscriptionButton from './ManageSubscriptionButton.jsx';
import { Button } from '@/components/ui/button';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';

export default function PlansList({ className }) {
	const { plans, loading, error } = useEcommerceSubscriptionsPlans();
	const { subscriptions, polling, isAuthenticated } = useSubscriptionAuth();
	const [isAnnual, setIsAnnual] = useState(true);
	const { t } = useLanguage();

	if (loading) {
		return (
			<div className={className ?? 'grid gap-6 md:grid-cols-4'}>
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="rounded-2xl border bg-card p-6 h-96 animate-pulse" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-destructive font-medium text-center max-w-xl mx-auto">
				{error.message || t('common.error')}
			</p>
		);
	}

	const freeTier = {
		id: 'free',
		title: t('common.free'),
		description: t('plansPage.list.free.desc'),
		price: t('comparisonTable.priceFree'),
		features: [0, 1, 2, 3].map(i => t(`plansPage.list.free.features.${i}`))
	};

	const paidTiersDisplay = plans.map(plan => {
		const monthlyVariant = plan.variants?.find(v => v.title.toLowerCase().includes('month') || v.title.toLowerCase().includes('mes')) || plan.variants?.[0];
		const annualVariant = plan.variants?.find(v => v.title.toLowerCase().includes('year') || v.title.toLowerCase().includes('año'));
		
		const activeVariant = (isAnnual && annualVariant) ? annualVariant : monthlyVariant;

		let features = [];
		let highlight = null;
		let savings = null;
		let themeBg = 'bg-card';
		let accentColor = 'text-foreground';

		if (plan.title.toLowerCase().includes('básico') || plan.title.toLowerCase().includes('basico')) {
			features = [0, 1, 2, 3].map(i => t(`plansPage.list.basico.features.${i}`));
			savings = t('plansPage.list.basico.saveText');
			themeBg = 'bg-card';
			accentColor = 'text-foreground';
		} else if (plan.title.toLowerCase().includes('pro')) {
			features = [0, 1, 2, 3].map(i => t(`plansPage.list.pro.features.${i}`));
			highlight = t('plansPage.list.pro.badge');
			savings = t('plansPage.list.pro.saveText');
			themeBg = 'bg-background';
			accentColor = 'text-primary';
		} else if (plan.title.toLowerCase().includes('premium')) {
			features = [0, 1, 2, 3].map(i => t(`plansPage.list.premium.features.${i}`));
			highlight = t('plansPage.list.premium.badge');
			savings = t('plansPage.list.premium.saveText');
			themeBg = 'bg-card';
			accentColor = 'text-accent';
		}

		return {
			...plan,
			activeVariant,
			features,
			highlight,
			savings,
			themeBg,
			accentColor
		};
	});

	const hasAnyActiveSub = subscriptions.some(
		(subscription) => subscription && (subscription.status === 'active' || subscription.status === 'trialing'),
	);

	return (
		<div className="w-full">
			{polling && (
				<div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-background p-4 mx-auto max-w-md justify-center shadow-sm">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-sm font-bold font-sans text-foreground">{t('subs.updating')}</p>
				</div>
			)}

			<div className="flex justify-center items-center mb-14">
				<div className="bg-secondary p-1.5 rounded-full inline-flex relative border border-border">
					<button
						onClick={() => setIsAnnual(false)}
						className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold font-sans transition-colors duration-200 ${
							!isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
						}`}
					>
						{t('plansPage.list.monthly')}
					</button>
					<button
						onClick={() => setIsAnnual(true)}
						className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold font-sans transition-colors duration-200 flex items-center gap-2 ${
							isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
						}`}
					>
						{t('plansPage.list.yearly')}
						<span className="bg-accent/25 text-primary text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">{t('plansPage.list.save')}</span>
					</button>
					
					{/* Sliding active pill */}
					<div 
						className="absolute top-1.5 bottom-1.5 w-[50%] bg-background rounded-full shadow-sm transition-transform duration-300 ease-in-out border border-border/50"
						style={{ transform: isAnnual ? (document.documentElement.dir === 'rtl' ? 'translateX(-94%)' : 'translateX(94%)') : 'translateX(0)' }}
					/>
				</div>
			</div>

			<div className={className ?? 'grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto'}>
				{/* FREE TIER CARD */}
				<div className="relative flex flex-col overflow-hidden rounded-2xl border border-border border-t-4 border-t-accent bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
					<div className="mb-6">
						<p className="eyebrow mb-3 text-accent">Para comenzar</p>
						<h3 className="text-3xl font-semibold mb-2 text-primary">{freeTier.title}</h3>
						<p className="text-muted-foreground text-sm min-h-[40px] leading-relaxed">{freeTier.description}</p>
					</div>
					
					<p className="text-4xl font-bold mb-8 text-primary font-sans tracking-tight">
						{freeTier.price}
						<span className="text-base font-medium text-muted-foreground ml-1">{t('common.monthShort')}</span>
					</p>

					<div className="mb-8 flex-grow">
						<ul className="space-y-4">
							{freeTier.features.map((feat, i) => (
								<li key={i} className="flex items-start gap-3">
									<div className="mt-0.5 bg-muted rounded-full p-1">
										<Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
									</div>
									<span className="text-sm font-medium text-foreground">{feat}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mt-auto">
						{isAuthenticated ? (
							!hasAnyActiveSub ? (
								<div className="w-full text-center py-3 bg-muted rounded-xl text-sm font-bold font-sans text-muted-foreground border border-border/50">
									{t('plansPage.list.currentPlan')}
								</div>
							) : (
								<Button asChild variant="outline" className="w-full h-12 font-bold font-sans">
									<Link to="/dashboard">{t('plansPage.list.viewFeatures')}</Link>
								</Button>
							)
						) : (
							<Button asChild variant="outline" className="w-full h-12 font-bold font-sans">
								<Link to="/signup">{t('plansPage.list.startFree')}</Link>
							</Button>
						)}
					</div>
				</div>

				{/* PAID TIERS */}
				{paidTiersDisplay.length === 0 ? (
					<div className="md:col-span-2 lg:col-span-3 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-accent/60 bg-card/60 p-8 text-center">
						<div className="max-w-md">
							<p className="eyebrow mb-4 text-accent">Próximamente</p>
							<h3 className="mb-3 text-3xl font-medium text-primary">Más espacio para historias que crecen.</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								Estamos preparando nuestros planes de memoria. Mientras tanto, puedes comenzar a conservar tus primeros recuerdos.
							</p>
						</div>
					</div>
				) : null}
				{paidTiersDisplay.map((plan) => (
					<PaidPlanCard 
						key={plan.id} 
						plan={plan} 
						subscriptions={subscriptions} 
						hasAnyActiveSub={hasAnyActiveSub} 
						isAnnual={isAnnual}
						t={t}
					/>
				))}
			</div>
		</div>
	);
}

function PaidPlanCard({ plan, subscriptions, hasAnyActiveSub, isAnnual, t }) {
	const isCurrentPlan = subscriptions.some(
		(subscription) => subscription && subscription.product_id === plan.id && (subscription.status === 'active' || subscription.status === 'trialing'),
	);
	const isLocked = hasAnyActiveSub && !isCurrentPlan;

	return (
		<div className={`relative flex flex-col rounded-2xl border border-t-4 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${plan.themeBg} ${plan.highlight ? 'border-primary bg-primary text-primary-foreground shadow-xl z-10' : 'border-border border-t-accent shadow-sm'}`}>
			{plan.highlight && (
				<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
					<span className="bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm font-sans">
						{plan.highlight}
					</span>
				</div>
			)}
			
			<div className="mb-6 mt-2">
				<div className="flex justify-between items-start mb-2">
					<h3 className={`text-3xl font-semibold ${plan.highlight ? 'text-primary-foreground' : plan.accentColor}`}>{plan.title}</h3>
					{isCurrentPlan && (
						<span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider font-sans">
							{t('plansPage.list.currentPlan')}
						</span>
					)}
				</div>
				<p className={`text-sm min-h-[40px] leading-relaxed ${plan.highlight ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>{plan.description}</p>
			</div>

			<div className="mb-8">
				<p className={`text-4xl font-bold flex items-end gap-1 font-sans tracking-tight ${plan.highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
					{plan.activeVariant?.sale_price_in_cents != null
						? plan.activeVariant.sale_price_formatted
						: plan.activeVariant?.price_formatted || '—'}
					<span className={`text-base font-medium mb-1 ml-1 ${plan.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
						{t('common.monthShort')}
					</span>
				</p>
				{isAnnual && plan.savings ? (
					<p className={`text-sm font-bold font-sans mt-3 inline-block px-3 py-1 rounded-lg ${plan.highlight ? 'bg-white/10 text-accent' : 'bg-accent/15 text-primary'}`}>
						{plan.savings}
					</p>
				) : (
					<p className="text-sm font-medium text-transparent mt-3 px-3 py-1">{t('plansPage.list.space')}</p>
				)}
			</div>

			<div className="mb-8 flex-grow">
				<ul className="space-y-4">
					{plan.features.map((feat, i) => (
						<li key={i} className="flex items-start gap-3">
							<div className={`mt-0.5 rounded-full p-1 ${plan.highlight ? 'bg-white/10' : 'bg-muted'}`}>
								<Check className={`w-3.5 h-3.5 shrink-0 ${plan.highlight ? 'text-accent' : 'text-foreground'}`} />
							</div>
							<span className={`text-sm font-medium ${plan.highlight ? 'text-primary-foreground/85' : 'text-foreground'}`}>{feat}</span>
						</li>
					))}
				</ul>
			</div>

			<div className="mt-auto space-y-3">
				{plan.activeVariant && (
					isCurrentPlan ? (
						<ManageSubscriptionButton className="w-full rounded-xl border border-border px-4 py-3 font-bold font-sans h-12" />
					) : isLocked ? (
						<div className="space-y-2 text-center">
							<p className="text-xs text-muted-foreground mb-2 font-medium">{t('subs.changePortal')}</p>
							<ManageSubscriptionButton className="w-full rounded-xl border border-border px-4 py-3 font-bold font-sans h-12" />
						</div>
					) : (
						<SubscribeButton
							plan={plan}
							variant={plan.activeVariant}
							label={`${t('plansPage.list.choose')} ${plan.title}`}
						/>
					)
				)}
			</div>
		</div>
	);
}
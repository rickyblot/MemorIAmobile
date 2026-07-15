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
				<div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-background p-4 mx-auto max-w-md justify-center shadow-subtle">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-sm font-bold font-sans text-foreground">{t('subs.updating')}</p>
				</div>
			)}

			<div className="flex justify-center items-center mb-12">
				<div className="bg-muted p-1.5 rounded-full inline-flex relative shadow-inner">
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
						<span className="bg-primary/10 text-primary text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">{t('plansPage.list.save')}</span>
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
				<div className={`rounded-3xl border border-border bg-card p-8 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
					<div className="mb-6">
						<h3 className="text-xl font-bold mb-2 text-foreground font-sans">{freeTier.title}</h3>
						<p className="text-muted-foreground text-sm min-h-[40px] leading-relaxed">{freeTier.description}</p>
					</div>
					
					<p className="text-4xl font-extrabold mb-8 text-foreground font-sans tracking-tight">
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
									<Link to="/features">{t('plansPage.list.viewFeatures')}</Link>
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
					<div className="md:col-span-2 lg:col-span-3 flex items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center">
						<p className="text-sm text-muted-foreground max-w-md">
							No hay planes de pago cargados. Verifica productos <strong>subscription</strong> en Hostinger Ecommerce y <code className="text-xs">VITE_ECOMMERCE_STORE_ID</code>.
						</p>
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
		<div className={`rounded-3xl border p-8 flex flex-col relative transition-all duration-300 shadow-sm hover:shadow-md ${plan.themeBg} ${plan.highlight ? 'ring-2 ring-primary border-transparent scale-[1.02] shadow-lg z-10' : 'border-border'}`}>
			{plan.highlight && (
				<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
					<span className={`bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm font-sans`}>
						{plan.highlight}
					</span>
				</div>
			)}
			
			<div className="mb-6 mt-2">
				<div className="flex justify-between items-start mb-2">
					<h3 className={`text-xl font-bold font-sans ${plan.accentColor}`}>{plan.title}</h3>
					{isCurrentPlan && (
						<span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider font-sans">
							{t('plansPage.list.currentPlan')}
						</span>
					)}
				</div>
				<p className="text-muted-foreground text-sm min-h-[40px] leading-relaxed">{plan.description}</p>
			</div>

			<div className="mb-8">
				<p className="text-4xl font-extrabold text-foreground flex items-end gap-1 font-sans tracking-tight">
					{plan.activeVariant?.sale_price_in_cents != null
						? plan.activeVariant.sale_price_formatted
						: plan.activeVariant?.price_formatted || '—'}
					<span className="text-base font-medium text-muted-foreground mb-1 ml-1">
						{t('common.monthShort')}
					</span>
				</p>
				{isAnnual && plan.savings ? (
					<p className="text-sm font-bold font-sans text-secondary mt-3 bg-secondary/10 inline-block px-3 py-1 rounded-lg">
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
							<div className={`mt-0.5 rounded-full p-1 ${plan.highlight ? 'bg-primary/10' : 'bg-muted'}`}>
								<Check className={`w-3.5 h-3.5 shrink-0 ${plan.highlight ? 'text-primary' : 'text-foreground'}`} />
							</div>
							<span className="text-sm font-medium text-foreground">{feat}</span>
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
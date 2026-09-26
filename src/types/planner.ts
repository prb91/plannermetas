export interface ChannelGoal {
  id: string;
  name: string;
  percentage: number; // 0 - 100
  targetRevenue: number;
  actualRevenue: number;
  leadsTarget: number;
  leadsActual: number;
  conversionRate: number;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  targetRevenue: number;
  actualRevenue: number;
  commissionRate: number; // %
  dealsClosed: number;
}

export interface MonthlyMilestone {
  month: string;
  target: number;
  actual: number;
  status: 'pending' | 'completed' | 'danger';
}

export interface PlannerState {
  companyName: string;
  responsibleName: string;
  planningPeriod: string; // Ex: "2026 - 1º Semestre"
  targetAnnualRevenue: number;
  targetMonthlyRevenue: number;
  currentActualRevenue: number;
  averageTicket: number;
  leadToOpportunityRate: number; // % (ex: 25)
  opportunityToProposalRate: number; // % (ex: 50)
  proposalToSaleRate: number; // % (ex: 30)
  channels: ChannelGoal[];
  team: SalesRep[];
  monthlyMilestones: MonthlyMilestone[];
  notes: string;
}

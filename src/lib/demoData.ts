export const hero = require('../../imgs/main.jpg')

export const services = [
  { id: 'svc-corte', name: 'Corte Feminino', duration_min: 60, price_cents: 8000, tags: ['popular'] },
  { id: 'svc-escova', name: 'Escova', duration_min: 45, price_cents: 7000, tags: ['popular'] },
  { id: 'svc-chapinha', name: 'Chapinha', duration_min: 30, price_cents: 5000 },
  { id: 'svc-progressiva', name: 'Progressiva', duration_min: 180, price_cents: 45000, tags: ['popular'] },
  { id: 'svc-selagem', name: 'Selagem', duration_min: 120, price_cents: 30000 },
  { id: 'svc-botox', name: 'Botox Capilar', duration_min: 120, price_cents: 32000, tags: ['novo'] },
  { id: 'svc-hidratacao', name: 'Hidratação', duration_min: 45, price_cents: 10000 },
  { id: 'svc-reconstrucao', name: 'Reconstrução', duration_min: 60, price_cents: 15000 },
  { id: 'svc-coloracao', name: 'Coloração', duration_min: 120, price_cents: 28000 },
  { id: 'svc-mechas', name: 'Mechas', duration_min: 180, price_cents: 42000 },
  { id: 'svc-luzes', name: 'Luzes', duration_min: 180, price_cents: 42000 },
  { id: 'svc-tonalizacao', name: 'Tonalização', duration_min: 60, price_cents: 12000 },
  { id: 'svc-babyliss', name: 'Babyliss', duration_min: 45, price_cents: 9000 },
  { id: 'svc-penteado', name: 'Penteado', duration_min: 90, price_cents: 22000 },
  { id: 'svc-maquiagem', name: 'Maquiagem', duration_min: 90, price_cents: 22000, tags: ['novo'] },
  { id: 'svc-manicure', name: 'Manicure', duration_min: 45, price_cents: 8000 },
  { id: 'svc-pedicure', name: 'Pedicure', duration_min: 60, price_cents: 10000 },
  { id: 'svc-alongamento', name: 'Alongamento de Unhas', duration_min: 120, price_cents: 32000, tags: ['novo'] },
  { id: 'svc-sobrancelha', name: 'Design de Sobrancelha', duration_min: 45, price_cents: 7000, tags: ['novo'] },
  { id: 'svc-depilacao', name: 'Depilação Feminina', duration_min: 60, price_cents: 15000 },
]

export const professionals = [
  { id: 'pro-ana', name: 'Ana Souza', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Corte Feminino', 'Escova', 'Chapinha', 'Babyliss', 'Penteado'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Ana%20Souza&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.8 },
  { id: 'pro-beatriz', name: 'Beatriz Oliveira', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Coloração', 'Mechas', 'Luzes', 'Tonalização', 'Hidratação', 'Reconstrução'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Beatriz%20Oliveira&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.7 },
  { id: 'pro-carla', name: 'Carla Mendes', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Progressiva', 'Selagem', 'Botox Capilar', 'Manicure', 'Pedicure', 'Alongamento de Unhas'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Carla%20Mendes&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.6 },
  { id: 'pro-daniela', name: 'Daniela Ribeiro', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Escova', 'Chapinha', 'Corte Feminino'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Daniela%20Ribeiro&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.5 },
  { id: 'pro-fernanda', name: 'Fernanda Costa', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Hidratação', 'Reconstrução', 'Botox Capilar'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Fernanda%20Costa&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.7 },
  { id: 'pro-julia', name: 'Julia Martins', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Coloração', 'Luzes', 'Tonalização'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Julia%20Martins&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.6 },
  { id: 'pro-mariana', name: 'Mariana Alves', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.', specialties: ['Mechas', 'Penteado', 'Babyliss'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Mariana%20Alves&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.8 },
]

export const portfolios = [
  { id: 'pf-ana-1', professional_id: 'pro-ana', image_url: require('../../imgs/portfolios/1.jpg'), description: 'Corte e coloração' },
  { id: 'pf-ana-2', professional_id: 'pro-ana', image_url: require('../../imgs/portfolios/2.jpg'), description: 'Finalização com escova' },
  { id: 'pf-ana-3', professional_id: 'pro-ana', image_url: require('../../imgs/portfolios/3.jpg'), description: 'Penteado casual' },

  { id: 'pf-beatriz-1', professional_id: 'pro-beatriz', image_url: require('../../imgs/portfolios/2.jpg'), description: 'Coloração avançada' },
  { id: 'pf-beatriz-2', professional_id: 'pro-beatriz', image_url: require('../../imgs/portfolios/3.jpg'), description: 'Mechas modernas' },
  { id: 'pf-beatriz-3', professional_id: 'pro-beatriz', image_url: require('../../imgs/portfolios/4.jpg'), description: 'Luzes suaves' },

  { id: 'pf-carla-1', professional_id: 'pro-carla', image_url: require('../../imgs/portfolios/3.jpg'), description: 'Nail art' },
  { id: 'pf-carla-2', professional_id: 'pro-carla', image_url: require('../../imgs/portfolios/4.jpg'), description: 'Selagem capilar' },
  { id: 'pf-carla-3', professional_id: 'pro-carla', image_url: require('../../imgs/portfolios/5.jpg'), description: 'Alongamento de unhas' },

  { id: 'pf-daniela-1', professional_id: 'pro-daniela', image_url: require('../../imgs/portfolios/4.jpg'), description: 'Finalização com escova' },
  { id: 'pf-daniela-2', professional_id: 'pro-daniela', image_url: require('../../imgs/portfolios/5.jpg'), description: 'Chapinha e brilho' },
  { id: 'pf-daniela-3', professional_id: 'pro-daniela', image_url: require('../../imgs/portfolios/6.jpg'), description: 'Corte feminino' },

  { id: 'pf-fernanda-1', professional_id: 'pro-fernanda', image_url: require('../../imgs/portfolios/5.jpg'), description: 'Tratamento e hidratação' },
  { id: 'pf-fernanda-2', professional_id: 'pro-fernanda', image_url: require('../../imgs/portfolios/6.jpg'), description: 'Reconstrução capilar' },
  { id: 'pf-fernanda-3', professional_id: 'pro-fernanda', image_url: require('../../imgs/portfolios/1.jpg'), description: 'Botox capilar' },

  { id: 'pf-mariana-1', professional_id: 'pro-mariana', image_url: require('../../imgs/portfolios/6.jpg'), description: 'Penteado para evento' },
  { id: 'pf-mariana-2', professional_id: 'pro-mariana', image_url: require('../../imgs/portfolios/1.jpg'), description: 'Babyliss elegante' },
  { id: 'pf-mariana-3', professional_id: 'pro-mariana', image_url: require('../../imgs/portfolios/2.jpg'), description: 'Mechas delicadas' },
]

export const reviews = [
  { id: 'rv-1', professional_id: 'pro-ana', customer_id: 'cust-1', rating: 5, comment: 'Excelente atendimento!' },
  { id: 'rv-2', professional_id: 'pro-ana', customer_id: 'cust-2', rating: 4, comment: 'Muito bom.' },
]

const now = new Date()
export const availability_slots = Array.from({ length: 9 }).map((_, i) => {
  const start = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const pro = i % 3 === 0 ? 'pro-beatriz' : i % 2 === 0 ? 'pro-carla' : 'pro-ana'
  return { id: `slot-${i}`, professional_id: pro, start_time: start.toISOString(), end_time: end.toISOString(), status: i % 3 === 0 ? 'reserved' : 'available' }
})
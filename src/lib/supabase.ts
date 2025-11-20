import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined

function createMock(): any {
  const now = new Date()
  const hero = require('../../imgs/2149319785.jpg')
  const demo = {
    services: [
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
    ],
    professionals: [
      { id: 'pro-ana', name: 'Ana Souza', bio: 'Corte, escova e finalizações.', specialties: ['Corte Feminino', 'Escova', 'Chapinha', 'Babyliss', 'Penteado'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Ana%20Souza&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.8 },
      { id: 'pro-beatriz', name: 'Beatriz Oliveira', bio: 'Coloração, mechas e tratamentos.', specialties: ['Coloração', 'Mechas', 'Luzes', 'Tonalização', 'Hidratação', 'Reconstrução'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Beatriz%20Oliveira&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.7 },
      { id: 'pro-carla', name: 'Carla Mendes', bio: 'Alisamentos e unhas.', specialties: ['Progressiva', 'Selagem', 'Botox Capilar', 'Manicure', 'Pedicure', 'Alongamento de Unhas'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Carla%20Mendes&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.6 },
      { id: 'pro-daniela', name: 'Daniela Ribeiro', bio: 'Escova e styling diário.', specialties: ['Escova', 'Chapinha', 'Corte Feminino'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Daniela%20Ribeiro&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.5 },
      { id: 'pro-fernanda', name: 'Fernanda Costa', bio: 'Tratamentos capilares e hidratação.', specialties: ['Hidratação', 'Reconstrução', 'Botox Capilar'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Fernanda%20Costa&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.7 },
      { id: 'pro-julia', name: 'Julia Martins', bio: 'Coloração avançada e luzes.', specialties: ['Coloração', 'Luzes', 'Tonalização'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Julia%20Martins&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.6 },
      { id: 'pro-mariana', name: 'Mariana Alves', bio: 'Mechas e penteados.', specialties: ['Mechas', 'Penteado', 'Babyliss'], avatar_url: 'https://api.dicebear.com/6.x/lorelei/png?seed=Mariana%20Alves&backgroundType=gradientLinear&backgroundColor=ffd5dc', rating: 4.8 },
    ],
    portfolios: [
      { id: 'pf-1', professional_id: 'pro-ana', image_url: hero, description: 'Corte e coloração' },
      { id: 'pf-2', professional_id: 'pro-beatriz', image_url: hero, description: 'Coloração' },
      { id: 'pf-3', professional_id: 'pro-carla', image_url: hero, description: 'Nail art' },
    ],
    reviews: [
      { id: 'rv-1', professional_id: 'pro-ana', customer_id: 'cust-1', rating: 5, comment: 'Excelente atendimento!' },
      { id: 'rv-2', professional_id: 'pro-ana', customer_id: 'cust-2', rating: 4, comment: 'Muito bom.' },
    ],
    availability_slots: Array.from({ length: 9 }).map((_, i) => {
      const start = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const pro = i % 3 === 0 ? 'pro-beatriz' : i % 2 === 0 ? 'pro-carla' : 'pro-ana'
      return { id: `slot-${i}`, professional_id: pro, start_time: start.toISOString(), end_time: end.toISOString(), status: i % 3 === 0 ? 'reserved' : 'available' }
    }),
    bookings: [],
  }

  const builder: any = {
    _table: '',
    _filters: [] as { type: 'eq' | 'gte' | 'lte' | 'contains' | 'in'; col: string; val: any }[],
    select() { return this },
    order() { return this },
    eq(col: string, val: any) { this._filters.push({ type: 'eq', col, val }); return this },
    gte(col: string, val: any) { this._filters.push({ type: 'gte', col, val }); return this },
    lte(col: string, val: any) { this._filters.push({ type: 'lte', col, val }); return this },
    limit() { return this },
    contains(col: string, val: any) { this._filters.push({ type: 'contains', col, val }); return this },
    in(col: string, val: any[]) { this._filters.push({ type: 'in', col, val }); return this },
    single() { return this },
    insert(payload: any) { return Promise.resolve({ data: payload, error: null }) },
    update(payload: any) { return Promise.resolve({ data: payload, error: null }) },
    then(resolve: any) {
      const rows = (demo as any)[this._table] || []
      let data = rows
      for (const f of this._filters) {
        if (f.type === 'eq') data = data.filter((r: any) => String(r[f.col]) === String(f.val))
        else if (f.type === 'gte') data = data.filter((r: any) => new Date(r[f.col]).getTime() >= new Date(f.val).getTime())
        else if (f.type === 'lte') data = data.filter((r: any) => new Date(r[f.col]).getTime() <= new Date(f.val).getTime())
        else if (f.type === 'contains') data = data.filter((r: any) => (r[f.col] || []).some((x: any) => (f.val || []).includes(x)))
        else if (f.type === 'in') data = data.filter((r: any) => (f.val || []).map(String).includes(String(r[f.col])))
      }
      resolve({ data, error: null })
    },
  }
  const channel = {
    on() { return this },
    subscribe() { return this },
    unsubscribe() {},
  }
  return {
    from(table: string) { builder._table = table; builder._filters = []; return builder },
    channel() { return channel },
  }
}

export const supabase = url && key
  ? createClient(url, key, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createMock()
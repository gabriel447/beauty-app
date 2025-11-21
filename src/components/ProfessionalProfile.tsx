import { View, Text, Image, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { portfolios as demoPortfolios, reviews as demoReviews, services as demoServices } from '@/lib/demoData'
import { Professional, PortfolioItem, Review, Service } from '@/types'
import RealtimeSchedule from '@/components/RealtimeSchedule'

type Props = { professional: Professional }

export default function ProfessionalProfile({ professional }: Props) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [reviewsOpen, setReviewsOpen] = useState<boolean>(false)
  const [newRating, setNewRating] = useState<number>(0)
  const [newComment, setNewComment] = useState<string>('')
  useEffect(() => {
    const pf = demoPortfolios.filter((p) => String(p.professional_id) === String(professional.id))
    const rv = demoReviews.filter((r) => String(r.professional_id) === String(professional.id))
    const svFiltered = demoServices.filter((s) => (professional.specialties || []).includes(s.name))
    const hero = require('../../imgs/2149319785.jpg')
    setPortfolio(pf.length > 0 ? pf as any : [
      { id: `pf-${professional.id}-1`, professional_id: professional.id, image_url: hero, description: 'Antes e depois de corte' },
      { id: `pf-${professional.id}-2`, professional_id: professional.id, image_url: hero, description: 'Coloração com técnica X' },
      { id: `pf-${professional.id}-3`, professional_id: professional.id, image_url: hero, description: 'Finalização com babyliss' },
    ])
    setReviews(rv.length > 0 ? rv as any : [
      { id: `rv-${professional.id}-1`, professional_id: professional.id, customer_id: 'cust-demo', rating: 5, comment: 'Atendimento incrível e resultado perfeito!' },
      { id: `rv-${professional.id}-2`, professional_id: professional.id, customer_id: 'cust-demo', rating: 4, comment: 'Gostei muito, voltarei com certeza.' },
    ])
    setServices(svFiltered.length > 0 ? svFiltered as any : (professional.specialties || []).map((name, i) => ({ id: `fake-${i}-${name}`, name, duration_min: 60, price_cents: 0 } as Service)))
  }, [professional.id])
  const iconFor = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('corte')) return '✂️'
    if (n.includes('escova')) return '💨'
    if (n.includes('chapinha')) return '🔥'
    if (n.includes('progressiva')) return '💁‍♀️'
    if (n.includes('hidrat')) return '💧'
    if (n.includes('reconstr')) return '🧪'
    if (n.includes('color')) return '🎨'
    if (n.includes('mecha') || n.includes('luzes')) return '✨'
    if (n.includes('tonal')) return '🌈'
    if (n.includes('babyliss')) return '🌀'
    if (n.includes('penteado')) return '👱‍♀️'
    if (n.includes('maqui')) return '💄'
    if (n.includes('manicure') || n.includes('pedicure')) return '💅'
    if (n.includes('sobrancelha')) return '👁️'
    if (n.includes('depila')) return '🧴'
    return '⭐'
  }
  const publishReview = async () => {
    if (!newRating || !newComment.trim()) return
    const payload: any = {
      id: String(Date.now()),
      professional_id: professional.id,
      customer_id: 'local-user',
      rating: newRating,
      comment: newComment.trim(),
    }
    setReviews((list) => [payload, ...list])
    setNewRating(0); setNewComment('')
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        {professional.avatar_url ? (
          <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb' }} />
        )}
        <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 12 }}>{professional.name}</Text>
        <Text style={{ color: '#374151', marginTop: 4 }}>{professional.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae lorem ipsum.'}</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Especialidades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {services.map((item) => (
              <View key={String(item.id)} style={{ width: 120, marginRight: 12, padding: 12, backgroundColor: '#fdf2f8', borderRadius: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fce7f3', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 20 }}>{iconFor(item.name)}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600' }} numberOfLines={2}>{item.name}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>{Math.round(item.duration_min)} min</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Serviços</Text>
        {services.map((s) => (
          <View key={String(s.id)} style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16 }}>{s.name}</Text>
            <Text style={{ color: '#6b7280' }}>{Math.round(s.duration_min)} min</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Portfólio</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {portfolio.map((item) => (
            <View key={String(item.id)} style={{ width: 180, marginRight: 12 }}>
              <Image source={typeof item.image_url === 'number' ? item.image_url : { uri: item.image_url }} style={{ width: 180, height: 160, borderRadius: 12 }} />
              <Text style={{ marginTop: 6, fontSize: 13 }} numberOfLines={2}>{item.description || 'Trabalho realizado com cuidado e atenção.'}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Avaliações</Text>
        <TouchableOpacity onPress={() => setReviewsOpen((v) => !v)} style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 10 }}>
          <Text style={{ fontWeight: '600', color: '#111827' }}>{reviewsOpen ? 'Fechar' : 'Ver avaliações'}</Text>
        </TouchableOpacity>
        {reviewsOpen && (
          <View style={{ marginTop: 12 }}>
            {reviews.map((item) => (
              <View key={String(item.id)} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: '500' }}>{item.rating}★</Text>
                <Text style={{ color: '#374151' }}>{item.comment}</Text>
              </View>
            ))}
            <View style={{ marginTop: 8, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }}>
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Publicar avaliação</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                {[1,2,3,4,5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setNewRating(n)}>
                    <Text style={{ fontSize: 20, marginRight: 6, color: newRating >= n ? '#f59e0b' : '#9ca3af' }}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Escreva sua avaliação"
                multiline
                style={{ minHeight: 60, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}
              />
              <TouchableOpacity onPress={publishReview} disabled={!newRating || !newComment.trim()} style={{ marginTop: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: newRating && newComment.trim() ? '#ec4899' : '#fde7f3', borderRadius: 10 }}>
                <Text style={{ color: newRating && newComment.trim() ? '#ffffff' : '#ec4899', fontWeight: '600', textAlign: 'center' }}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Agenda</Text>
        <RealtimeSchedule professionalId={professional.id} />
      </View>
    </ScrollView>
  )
}
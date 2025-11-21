import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Modal, Animated } from 'react-native'
import { useEffect, useState } from 'react'
import { portfolios as demoPortfolios, reviews as demoReviews, services as demoServices } from '@/lib/demoData'
import { Professional, PortfolioItem, Review, Service } from '@/types'

type Props = { professional: Professional }

export default function ProfessionalProfile({ professional }: Props) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false)
  const [modalOpacity] = useState(new Animated.Value(0))
  const [modalScale] = useState(new Animated.Value(0.96))
  
  const [newRating, setNewRating] = useState<number>(0)
  const [newComment, setNewComment] = useState<string>('')
  useEffect(() => {
    const pf = demoPortfolios.filter((p) => String(p.professional_id) === String(professional.id))
    const rv = demoReviews.filter((r) => String(r.professional_id) === String(professional.id))
    const svFiltered = demoServices.filter((s) => (professional.specialties || []).includes(s.name))
    const hero = require('../../imgs/portfolios/1.jpg')
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
  
  useEffect(() => {
    if (reviewModalOpen) {
      Animated.parallel([
        Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 0.96, duration: 200, useNativeDriver: true }),
      ]).start()
    }
  }, [reviewModalOpen])
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
  const publishEnabled = !!newRating && newComment.trim().length >= 12
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        {professional.avatar_url ? (
          <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb' }} />
        )}
        <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 12 }}>{professional.name}</Text>
        <Text style={{ color: '#374151', marginTop: 4 }}>{professional.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, lectus at facilisis malesuada, turpis eros elementum leo, quis posuere urna justo eget nibh. Curabitur posuere, velit in fermentum convallis, sapien lacus luctus elit, a dictum mi arcu vitae risus.'}</Text>
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
        <View style={{ marginTop: 12 }}>
          {reviews.map((item) => (
            <View key={String(item.id)} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                {[0,1,2,3,4].map((i) => (
                  <Text key={i} style={{ fontSize: 16, marginRight: 2, color: i < item.rating ? '#f59e0b' : '#9ca3af' }}>★</Text>
                ))}
              </View>
              <Text style={{ color: '#374151' }}>{item.comment}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => setReviewModalOpen(true)} style={{ marginTop: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ec4899', borderRadius: 10 }}>
            <Text style={{ color: '#ffffff', fontWeight: '600', textAlign: 'center' }}>Publicar avaliação</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={reviewModalOpen} transparent animationType="fade" onRequestClose={() => setReviewModalOpen(false)}>
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', opacity: modalOpacity }}>
          <Animated.View style={{ width: '90%', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, transform: [{ scale: modalScale }] }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Publicar avaliação</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {[1,2,3,4,5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setNewRating(n)}>
                  <Text style={{ fontSize: 22, marginRight: 6, color: newRating >= n ? '#f59e0b' : '#9ca3af' }}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escreva sua avaliação"
              multiline
              style={{ minHeight: 80, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity onPress={() => { setReviewModalOpen(false); setNewRating(0); setNewComment('') }} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginRight: 8, backgroundColor: '#f3f4f6' }}>
                <Text style={{ color: '#111827', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { if (publishEnabled) { publishReview(); setReviewModalOpen(false) } }} disabled={!publishEnabled} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: publishEnabled ? '#ec4899' : '#fde7f3' }}>
                <Text style={{ color: publishEnabled ? '#ffffff' : '#ec4899', fontWeight: '600' }}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
      
    </ScrollView>
  )
}
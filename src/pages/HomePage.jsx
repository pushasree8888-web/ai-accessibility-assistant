import Hero from '../components/home/Hero'
import FeatureGrid from '../components/home/FeatureGrid'
import { features } from '../data/features'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid features={features} />
    </>
  )
}

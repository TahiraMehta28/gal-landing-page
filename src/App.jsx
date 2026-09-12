import { useRef } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Pathways from './components/Pathways'
import Ecosystem from './components/Ecosystem'
import IMT from './components/IMT'
import DiscoveryForm from './components/DiscoveryForm/DiscoveryForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  const formRef = useRef(null)

  // Pathway cards and the IMT CTA both jump into the discovery form at
  // step 1 \u2014 swap this for per-pathway starting steps if useful later.
  const handleSelectPathway = () => formRef.current?.goToStep(1)
  const handleImtInterest = () => formRef.current?.goToStep(1)

  return (
    <>
      <Nav />
      <Hero />
      <Pathways onSelectPathway={handleSelectPathway} />
      <Ecosystem />
      <FAQ />
      <DiscoveryForm ref={formRef} />
      <IMT onInterested={handleImtInterest} />
      <Footer />
    </>
  )
}

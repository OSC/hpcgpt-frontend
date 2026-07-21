import React from 'react'
import { ModelToggles } from '../ModelToggles'
import {
  type OSCHostedVLMProvider,
  ProviderNames,
} from '~/utils/modelProviders/LLMProvider'
import ProviderCard from './ProviderCard'

export default function OSCHostedVLMProviderInput({
  provider,
  form,
  isLoading,
}: {
  provider: OSCHostedVLMProvider
  form: any
  isLoading: boolean
}) {
  return (
    <ProviderCard
      providerName="OSC Hosted LLMs/VLMs"
      providerKey={ProviderNames.OSCHostedVLM}
      provider={provider}
      form={form}
      isLoading={isLoading}
      externalUrl="https://www.osc.edu/ai"
      description="Large Language and Vision Language Models hosted by OSC. These models can understand and analyze images in addition to text."
    >
      <ModelToggles form={form} provider={provider} />
    </ProviderCard>
  )
}

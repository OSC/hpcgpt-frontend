import React from 'react'
import { ModelToggles } from '../ModelToggles'
import {
  type OSCHostedProvider,
  ProviderNames,
} from '~/utils/modelProviders/LLMProvider'
import ProviderCard from './ProviderCard'

export default function OSCHostedLLmsProviderInput({
  provider,
  form,
  isLoading,
}: {
  provider: OSCHostedProvider
  form: any
  isLoading: boolean
}) {
  return (
    <ProviderCard
      providerName="OSC Hosted LLMs"
      providerKey={ProviderNames.OSCHosted}
      provider={provider}
      form={form}
      isLoading={isLoading}
      externalUrl="https://www.osc.edu/ai"
      description={
        <>
          These models are hosted at the Ohio Supercomputer Center. They&apos;re free.
        </>
      }
    >
      <ModelToggles form={form} provider={provider} />
    </ProviderCard>
  )
}

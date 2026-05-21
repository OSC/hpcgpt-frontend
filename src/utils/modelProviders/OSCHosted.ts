import {
  ProviderNames,
  type OSCHostedProvider,
} from '~/utils/modelProviders/LLMProvider'
import { OllamaModelIDs, OllamaModels, type OllamaModel } from './ollama'

export const getOSCHostedModels = async (
  oscHostedProvider: OSCHostedProvider,
): Promise<OSCHostedProvider> => {
  delete oscHostedProvider.error // Remove the error property if it exists
  oscHostedProvider.provider = ProviderNames.OSCHosted

  if (!oscHostedProvider.enabled) {
    oscHostedProvider.models = []
    return oscHostedProvider
  }

  // Store existing model states
  const existingModelStates = new Map<
    string,
    { enabled: boolean; default: boolean }
  >()
  if (oscHostedProvider.models) {
    oscHostedProvider.models.forEach((model) => {
      existingModelStates.set(model.id, {
        enabled: model.enabled ?? true,
        default: model.default ?? false,
      })
    })
  }

  try {
    // /api/tags - all downloaded models (can be loaded on demand)
    // /api/ps - all HOT AND LOADED models

    const headers = {
      Authorization: `Bearer ${process.env.OSC_HOSTED_API_KEY || ''}`,
    }

    const response = await fetch(process.env.OLLAMA_SERVER_URL + '/api/tags', {
      headers,
    })

    if (!response.ok) {
      oscHostedProvider.error = `HTTP error ${response.status} ${response.statusText}.`
      oscHostedProvider.models = [] // clear any previous models.
      return oscHostedProvider as OSCHostedProvider
    }

    const data = await response.json()
    const downloadedModelIds: string[] = Array.isArray(data?.models)
      ? data.models
          .map((m: { model?: string }) => m?.model)
          .filter(
            (id: unknown): id is string =>
              typeof id === 'string' && id.length > 0,
          )
      : []

    // Only include models that are downloaded AND in our supported Ollama models list
    const availableSupportedIds = new Set<string>(
      Object.values(OllamaModelIDs) as string[],
    )

    const oscModels: OllamaModel[] = downloadedModelIds
      .filter((id: string) => availableSupportedIds.has(id))
      .map((id: string) => {
        const model = OllamaModels[id as OllamaModelIDs]
        const existingState = existingModelStates.get(model.id)
        return {
          ...model,
          enabled: existingState?.enabled ?? true,
          default: existingState?.default ?? false,
        }
      })

    oscHostedProvider.models = oscModels
    return oscHostedProvider as OSCHostedProvider
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    oscHostedProvider.error = message
    console.warn('ERROR in getOSCHostedModels', error)
    oscHostedProvider.models = [] // clear any previous models.
    return oscHostedProvider as OSCHostedProvider
  }
}

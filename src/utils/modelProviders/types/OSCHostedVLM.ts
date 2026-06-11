import { type OSCHostedVLMProvider } from '../LLMProvider'

export interface OSCHostedVLMModel {
  id: string
  name: string
  tokenLimit: number
  enabled: boolean
  default?: boolean
  temperature?: number
}

export enum OSCHostedVLMModelID {
  Llama_3_2_11B_Vision_Instruct = 'meta-llama/Llama-3.2-11B-Vision-Instruct',
  MOLMO_7B_D_0924 = 'allenai/Molmo-7B-D-0924',
  QWEN2_VL_72B_INSTRUCT = 'Qwen/Qwen2-VL-72B-Instruct',
  QWEN2_5VL_72B_INSTRUCT = 'Qwen/Qwen2.5-VL-72B-Instruct',
  QWEN2_5VL_32B_INSTRUCT = 'Qwen/Qwen2.5-VL-32B-Instruct',
  QWEN3_8B = 'Qwen/Qwen3-8B',
  QWEN3_CODER = 'qwen3-coder-30b',
  QWEN3 = 'qwen3',
}

export const OSCHostedVLMModels: Record<
  OSCHostedVLMModelID,
  OSCHostedVLMModel
> = {
  [OSCHostedVLMModelID.Llama_3_2_11B_Vision_Instruct]: {
    id: OSCHostedVLMModelID.Llama_3_2_11B_Vision_Instruct,
    name: 'Llama 3.2 11B Vision Instruct',
    tokenLimit: 128000,
    enabled: true,
  },
  [OSCHostedVLMModelID.MOLMO_7B_D_0924]: {
    id: OSCHostedVLMModelID.MOLMO_7B_D_0924,
    name: 'Molmo 7B D 0924',
    tokenLimit: 4096,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN2_VL_72B_INSTRUCT]: {
    id: OSCHostedVLMModelID.QWEN2_VL_72B_INSTRUCT,
    name: 'Qwen 2 VL 72B',
    tokenLimit: 8192,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN2_5VL_72B_INSTRUCT]: {
    id: OSCHostedVLMModelID.QWEN2_5VL_72B_INSTRUCT,
    name: 'Qwen 2.5 VL 72B (Best in open source)',
    tokenLimit: 23000,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN2_5VL_32B_INSTRUCT]: {
    id: OSCHostedVLMModelID.QWEN2_5VL_32B_INSTRUCT,
    name: 'Qwen 2.5 VL 32B',
    tokenLimit: 32000,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN3_8B]: {
    id: OSCHostedVLMModelID.QWEN3_8B,
    name: 'Qwen 3 8B',
    tokenLimit: 32000,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN3]: {
    id: OSCHostedVLMModelID.QWEN3,
    name: 'Qwen 3',
    tokenLimit: 32000,
    enabled: true,
  },
  [OSCHostedVLMModelID.QWEN3_CODER]: {
    id: OSCHostedVLMModelID.QWEN3,
    name: 'Qwen 3 Coder 30B',
    tokenLimit: 32000,
    enabled: true,
  },
}

export const getOSCHostedVLMModels = async (
  vlmProvider: OSCHostedVLMProvider,
): Promise<OSCHostedVLMProvider> => {
  delete vlmProvider.error // Clear any previous errors
  // Avoid importing ProviderNames here to prevent a circular dependency with LLMProvider.
  vlmProvider.provider =
    'OSCHostedVLM' as unknown as OSCHostedVLMProvider['provider']

  if (!vlmProvider.enabled) {
    vlmProvider.models = []
    return vlmProvider
  }

  // Store existing model states
  const existingModelStates = new Map<
    string,
    { enabled: boolean; default: boolean }
  >()
  if (vlmProvider.models) {
    vlmProvider.models.forEach((model) => {
      existingModelStates.set(model.id, {
        enabled: model.enabled ?? true,
        default: model.default ?? false,
      })
    })
  }

  try {
    vlmProvider.baseUrl = process.env.OSC_HOSTED_VLM_BASE_URL

    const headers = {
      Authorization: `Bearer ${process.env.OSC_HOSTED_API_KEY || ''}`,
    }

    const response = await fetch(`${vlmProvider.baseUrl}/models`, { headers })

    if (!response.ok) {
      vlmProvider.error =
        response.status === 530
          ? 'Model is offline'
          : `HTTP error ${response.status} ${response.statusText}`
      vlmProvider.models = [] // clear any previous models.
      return vlmProvider as OSCHostedVLMProvider
    }

    const data = await response.json()
    const vlmModels: OSCHostedVLMModel[] = data.data
      .filter((model: any) => {
        // Filter out experimental models (those not in our known models list)
        const knownModel = OSCHostedVLMModels[model.id as OSCHostedVLMModelID]
        return knownModel !== undefined
      })
      .map((model: any) => {
        const knownModel = OSCHostedVLMModels[model.id as OSCHostedVLMModelID]
        const existingState = existingModelStates.get(model.id)
        return {
          id: model.id,
          name: knownModel ? knownModel.name : 'Experimental: ' + model.id,
          tokenLimit: model.max_tokens || (knownModel ? knownModel.tokenLimit : 128000),
          enabled: existingState?.enabled ?? true,
          default: existingState?.default ?? false,
        }
      })

    vlmProvider.models = vlmModels
    return vlmProvider as OSCHostedVLMProvider
  } catch (error: any) {
    console.warn('Error fetching VLM models:', error)
    vlmProvider.models = [] // clear any previous models.
    return vlmProvider as OSCHostedVLMProvider
  }
}

import { useContext, useEffect, useState } from 'react' // Added useState
import { Divider, Flex, Modal, Title, createStyles, Tabs } from '@mantine/core'
import HomeContext from '~/pages/api/home/home.context'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import React from 'react'
import { ModelSelect } from './ModelSelect'
import { montserrat_heading, montserrat_paragraph } from 'fonts'
import { FancyRetrieval } from './FancyRetrieval'
import { DocumentGroupsItem } from './DocumentGroupsItem'
import { ToolsItem } from './ToolsItem'
import { ModelParams } from './ModelParams'
import { useTranslation } from 'react-i18next'
import { prebuiltAppConfig } from '~/utils/modelProviders/ConfigWebLLM'
import * as webllm from '@mlc-ai/web-llm'
import { type WebllmModel, webLLMModels } from '~/utils/modelProviders/WebLLM'
import { useAuth } from 'react-oidc-context'

const useStyles = createStyles((theme) => ({
  modalContent: {
    height: '95%',
    width: '90%',
    borderRadius: '.25rem',
    color: 'var(--modal-text)',
    backgroundColor: 'var(--modal)',
  },
  modalHeader: {
    width: '100%',
    borderRadius: '.5rem',
    backgroundColor: 'var(--modal-dark)',
  },
  title: {
    fontFamily: montserrat_heading.variable,
    fontWeight: 'bold',
  },
  tab: {
    fontFamily: montserrat_paragraph.variable,
    '&:hover': {
      color: 'white',
      backgroundColor: 'var(--modal-active)',
    },
    '&[data-active="true"]': {
      backgroundColor: 'var(--modal-active)',
      '&:hover': {
        color: 'white',
        backgroundColor: 'var(--modal-active)',
      },
    },
    whiteSpace: 'normal',
  },
  divider: {
    alignSelf: 'center',
    margin: '8px 0',
  },
}))
export const modelCached: WebllmModel[] = []

const appConfig = prebuiltAppConfig
// CHANGE THIS TO SEE EFFECTS OF BOTH, CODE BELOW DO NOT NEED TO CHANGE
appConfig.useIndexedDBCache = false
// if (appConfig.useIndexedDBCache) {
//   console.debug('WebLLM: Using IndexedDB Cache')
// } else {
//   console.debug('WebLLM: Using Cache API')
// }

export const UserSettings = () => {
  const {
    state: { selectedConversation, prompts, showModelSettings, groups, selectedGroup }, 
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext)

  const { t } = useTranslation('chat')
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const isSmallScreen = useMediaQuery('(max-width: 960px)')

/*
  const auth = useAuth()
  const groups = ((auth.user?.profile as any)?.groups as string[]) || []
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  useEffect(() => {
    const savedGroup = localStorage.getItem('selectedGroup')
    if (savedGroup) {
      setSelectedGroup(savedGroup)
    }
  }, [])
*/

  const loadModelCache = async () => {
    for (const model of webLLMModels) {
      const theCachedModel = await webllm.hasModelInCache(model.name, appConfig)
      if (theCachedModel) {
        if (
          !modelCached.some((cachedModel) => cachedModel.name === model.name)
        ) {
          modelCached.push(model)
        }
      }
      // console.log('hasModelInCache: ', modelCached)
    }
  }

  useEffect(() => {
    if (showModelSettings) {
      open()
      // console.log('model cached', modelCached)
      loadModelCache()
    } else {
      close()
    }
  }, [showModelSettings, open, close, loadModelCache])

  const handleClose = () => {
    homeDispatch({ field: 'showModelSettings', value: false })
  }

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const group = e.target.value
    console.log(`[${new Date().toISOString()}] UserSettings handleGroupChange: selected group =`, group, '(previous: selectedGroup from context = ?)')

    homeDispatch({ field: 'selectedGroup', value: group })
    //setSelectedGroup(group)

    //const baseUrl = process.env.OSC_HOSTED_VLM_BASE_URL || vlmUrl || ''

    if (group) {
      try {
        localStorage.setItem('selectedGroup', group)

      } catch (error) {
        console.error("Failed to parse or construct the new VLM URL:", error)
      }
    }
  }

  return (
    <Modal.Root opened={opened} onClose={handleClose} centered size={'800px'}>
      <Modal.Overlay
        style={{ width: '100%', color: 'var(--background-faded)' }}
      />
      <Modal.Content
        className={`${classes.modalContent} ${isSmallScreen ? 'p-2' : 'p-4'} overflow-x-hidden bg-[--modal] text-[--modal-text] md:rounded-lg`}
      >
        <Modal.Header className={classes.modalHeader}>
          <Modal.Title
            className={`${classes.title} ${montserrat_heading.variable} font-montserratHeading`}
          >
            Settings
          </Modal.Title>
          <Modal.CloseButton
            onClick={handleClose}
            aria-label="Close settings"
            className="text-[--foreground-faded] hover:text-[--foreground]"
          />
        </Modal.Header>
        <Modal.Body className="mt-4" p={isSmallScreen ? 'xs' : 'md'}>
          <Tabs
            orientation="vertical"
            defaultValue="model"
            variant="pills"
            styles={{
              tabsList: {
                width: isSmallScreen ? '25%' : 'auto',
              },
            }}
          >
            <Tabs.List mt={'xl'} ml="xs">
              <Tabs.Tab
                className={`${classes.tab} ${isSmallScreen ? 'px-2 text-xs' : 'text-md'} ${montserrat_paragraph.variable} font-montserratParagraph text-[--modal-text]`}
                value="model"
              >
                Model
              </Tabs.Tab>
              <Tabs.Tab
                className={`${classes.tab} ${isSmallScreen ? 'px-2 text-xs' : 'text-md'} ${montserrat_paragraph.variable} font-montserratParagraph text-[--modal-text]`}
                value="documentGroups"
              >
                Document Groups
              </Tabs.Tab>
              <Tabs.Tab
                className={`${classes.tab} ${isSmallScreen ? 'px-2 text-xs' : 'text-md'} ${montserrat_paragraph.variable} font-montserratParagraph text-[--modal-text]`}
                value="tools"
              >
                Tools
              </Tabs.Tab>
              <Tabs.Tab
                className={`${classes.tab} ${isSmallScreen ? 'px-2 text-xs' : 'text-md'} ${montserrat_paragraph.variable} font-montserratParagraph text-[--modal-text]`}
                value="groups"
              >
                Groups
              </Tabs.Tab>
            </Tabs.List>

            <Divider ml={'sm'} orientation="vertical" />

            <Tabs.Panel value="model" pt="xs">
              <Flex direction="column">
                <ModelSelect />
                <Divider
                  className={classes.divider}
                  w={isSmallScreen ? '70%' : '90%'}
                />
                <ModelParams
                  selectedConversation={selectedConversation}
                  prompts={prompts}
                  handleUpdateConversation={handleUpdateConversation}
                  t={t}
                />
                <Divider
                  className={classes.divider}
                  w={isSmallScreen ? '70%' : '90%'}
                />
                <FancyRetrieval />
              </Flex>
            </Tabs.Panel>

            <Tabs.Panel value="documentGroups" pt="xs">
              <DocumentGroupsItem />
            </Tabs.Panel>

            <Tabs.Panel value="tools" pt="xs">
              <ToolsItem />
            </Tabs.Panel>

            <Tabs.Panel value="groups" pt="xs" pl="sm">
              <Flex direction="column" gap="md">
                <Title order={4} className={`${montserrat_heading.variable} font-montserratHeading`}>
                  Select Project Group
                </Title>
                <p className={`text-sm text-[--foreground-faded] ${montserrat_paragraph.variable} font-montserratParagraph`}>
                  Assign a VLM address based on your Keycloak group claims.
                </p>
                
                <select 
                  id="group-select"
                  value={selectedGroup}
                  onChange={handleGroupChange}
                  className="border rounded p-2 max-w-[15rem] bg-[--background] text-[--foreground] border-[--border]"
                >
                  <option value="" disabled>Select a group...</option>
                  {groups.length > 0 ? (
                    groups.map((group: string, index: number) => (
                      <option key={index} value={group}>
                        {group}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No groups found</option>
                  )}
                </select>
              </Flex>
            </Tabs.Panel>
          </Tabs>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

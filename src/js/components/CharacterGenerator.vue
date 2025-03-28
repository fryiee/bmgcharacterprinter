<template>
  <div class="character-generator">
    <p v-if="error" class="character-generator__error">
      There was an error getting app data from Knight Models.
    </p>
    <template v-else>
      <div v-if="!loaded" class="flex flex-col noprint p-6">
        <h1 class="text-4xl">Loading...</h1>
      </div>
      <template v-else>
        <div class="flex flex-row items-center justify-between bg-yellow-400 mb-4 noprint p-6 border-black border-b-2">
          <div class="flex flex-col">
            <h1 class="text-4xl mb-1">Batman Miniature Game Crew Sheet Generator</h1>
            <h5 v-if="version" class="font-sans text-sm">Game Data Version: {{formattedVersion}} ({{version}})</h5>
            <h4 v-if="localOnly" class="font-sans text-lg text-red-800">LOCAL GAME DATA ONLY (No imagery)</h4>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex flex-row items-center justify-end mb-1">
              <h2 class="font-sans text-lg leading-none mr-1 text-right">Eternal?</h2>
              <input type="checkbox" :value="eternal" :checked="eternal" @input="toggleEternal"/>
            </div>
            <div class="flex flex-row items-center justify-end mb-1">
              <h2 class="font-sans text-lg leading-none mr-2 text-right">Show separate weapon traits card?</h2>
              <input type="checkbox" :value="showWeaponTraitsCard" :checked="showWeaponTraitsCard" @input="toggleWeaponTraitsCard"/>
            </div>
            <div class="flex flex-row items-center justify-end mb-1">
              <h2 class="font-sans text-lg leading-none mr-2 text-right">Show separate equipment card?</h2>
              <input type="checkbox" :value="showEquipmentCard" :checked="showEquipmentCard" @input="toggleEquipmentCard"/>
            </div>
          </div>
        </div>
        <div class="flex flex-col noprint mb-6 p-6">
          <h2 class="text-3xl font-sans mb-1">1. Select Crew</h2>
          <p class="mb-2">Selecting a crew populates the available equipment choices for each character. Changing crew will remove all existing characters you have added to your print sheet.</p>
          <a href="#" @click.prevent="crewInputExpanded = !crewInputExpanded" v-if="crew" class="border-2 inline-flex items-center justify-start border-black bg-yellow-400 w-auto self-start px-3 py-2">
            <h3 class="font-sans text-2xl">{{crew.name}}</h3>
            <font-awesome-icon icon="chevron-down" size="lg" :class="'ml-2 transform'+(crewInputExpanded ? ' rotate-180' : '')"></font-awesome-icon>
          </a>
          <div v-if="!crew || crewInputExpanded" class="relative z-10">
            <autocomplete ref="crewAutocomplete" key="crewAutocompleteField" :search="searchCrews" :get-result-value="getCrewResultValue" @submit="selectCrew" placeholder="Search for crews by name" class="mt-4 mb-0"></autocomplete>
          </div>
          <div class="mt-10 relative z-5" v-if="crew">
            <h2 class="text-3xl font-sans mb-1">2. Add Characters</h2>
            <p class="mb-2">Once you have added a character, you can click the character's card again to remove it from your print sheet.</p>
            <autocomplete :search="searchCharacters" placeholder="Search for characters by name or alias" key="characterAutocompleteField" ref="characterAutocomplete" :get-result-value="getResultValue" @submit="addCharacter">
              <template #result="{ result, props }">
                <li v-bind="props" class="cursor-pointer">
                  <div class="flex flex-row items-center justify-start">
                    <img v-if="!localOnly" class="h-10 w-10 object-cover mr-2" :src="result.image" :alt="result.name + ' image'"/>
                    <span class="inline-block">{{result.alias}}&nbsp;[{{result.name}}]</span>
                  </div>
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
        <div class="flex flex-col avoid-breaking-in-children">
          <div v-if="characters_to_print.length" class="noprint px-6">
            <h2 class="text-3xl font-sans mb-1">3. Customise Characters</h2>
            <p class="mb-2">You can toggle generic equipment or equipment granted by your crew from within the dropdown for each character. Please note that equipment limits are not enforced.</p>
          </div>
          <character :character="character" :local-only="localOnly" :index="index + 1" v-for="(character, index) in characters_to_print" :all-selected-characters="characters_to_print" :granted-traits="grantedTraits" :key="character.id" :crew="crew" :version="formattedVersion" :affiliations="affiliations" :traits="traits" :equipment="equipment" :upgrades="upgrades" :weapons="weapons" :show-equipment-card="showEquipmentCard" :combine-all-cards="combineAllCards" :show-weapon-traits-card="showWeaponTraitsCard" @click="removeCharacter"></character>
        </div>
        <div v-if="characters_to_print.length" class="flex flex-col noprint p-6 mt-4">
          <h2 class="text-3xl font-sans mb-2">4. Print Sheet</h2>
          <p class="font-serif text-lg">Use your browser's print dialog or click <a href="#" @click.prevent="openPrintDialog" class="font-bold underline">here</a>.</p>
          <p class="font-serif text-lg">Recommended print settings to match KM sized cards: <span class="underline">A4 / Portrait / Scale: 50% / Margins: Minimal</span></p>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { uuid } from 'uuidv4'
const localGameData = require('../gameData.json')

export default {
  data() {
    return {
      loaded: false,
      localOnly: true,
      error: false,
      game_data: null,
      version: null,
      eternal: 0,
      showEquipmentCard: 0,
      showWeaponTraitsCard: 0,
      combineAllCards: 0,
      crew: null,
      crewInputExpanded: false,
      characters_to_print: [],
    }
  },
  computed: {
    affiliations() {
      if (!this.game_data || !this.game_data.affiliations) {
        return []
      } else {
        if (this.eternal) {
          return this.game_data.affiliations
        } else {
          return this.game_data.affiliations.filter(affiliation => affiliation.eternal === false)
        }
      }
    },
    characters() {
      if (!this.game_data || !this.game_data.characters) {
        return []
      } else {
        if (this.eternal) {
          return this.game_data.characters
        } else {
          return this.game_data.characters.filter(character => character.eternal === false)
        }
      }
    },
    traits() {
      if (!this.game_data || !this.game_data.traits) {
        return []
      } else {
        return this.game_data.traits
      }
    },
    equipment() {
      if (!this.game_data || !this.game_data.equipment) {
        return []
      } else {
        return this.game_data.equipment
      }
    },
    upgrades() {
      if (!this.game_data || !this.game_data.upgrades) {
        return []
      } else {
        return this.game_data.upgrades
      }
    },
    weapons() {
      if (!this.game_data || !this.game_data.weapons) {
        return []
      } else {
        return this.game_data.weapons
      }
    },
    formattedVersion() {
      const date = new Date(parseInt(this.version) * 1000)
      return 'v.' + date.getUTCFullYear().toString() + '-' + (date.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + date.getUTCDate().toString().padStart(2, '0')
    },
    grantedTraits () {
      const grantedTraitList = []

      this.characters_to_print.forEach((character) => {
        const kaosAgentIndex = character.traits.findIndex(trait => trait.trait_id === 182)

        if (kaosAgentIndex !== -1) {
          grantedTraitList.push({
            rank: 5,
            id: 357
          })
        }

        const playNiceIndex = character.traits.findIndex(trait => trait.trait_id === 260)

        if (playNiceIndex !== -1) {
          grantedTraitList.push({
            rank: 5,
            id: 36
          })
        }

        const theBossIndex = character.traits.findIndex(trait => trait.trait_id === 335)

        if (theBossIndex !== -1) {
          grantedTraitList.push({
            rank: 5,
            id: 119
          })
        }

        const theUntouchableIndex = character.traits.findIndex(trait => trait.trait_id === 344)

        if (theUntouchableIndex !== -1) {
          grantedTraitList.push({
            rank: 5,
            id: 134
          })
        }
      })

      return grantedTraitList
    }
  },
  async mounted() {
    if (this.localOnly) {
      const gameData = localGameData.data
      window.localStorage.setItem('gamedata', JSON.stringify(gameData))
      window.localStorage.setItem('version', localGameData.version)
      this.version = localGameData.version
      this.loaded = true
      this.game_data = gameData
      this.loadCurrentCrew()
      this.loadEternalToggle()
      this.loadEquipmentCardToggle()
      this.loadWeaponTraitsCardToggle()
      this.loadCombineAllCardsToggle()
      this.loadCurrentCharacters()
    } else {
      try {
        const currentVersionResponse = await axios.get('https://corsproxy.io/?url=https://app.knightmodels.com/version', {})
        if (currentVersionResponse.status === 200) {
          const currentVersion = currentVersionResponse.data.version.toString()
          const localVersion = window.localStorage.getItem('version')
          if (currentVersion !== localVersion) {
            const gameDataResponse = await axios.get('https://corsproxy.io/?url=https://app.knightmodels.com/gamedata', {})
            if (gameDataResponse.status === 200) {
              const gameData = gameDataResponse.data
              window.localStorage.setItem('gamedata', JSON.stringify(gameData))
              window.localStorage.setItem('version', currentVersion)
              this.version = currentVersion
              this.loaded = true
              this.game_data = gameData
              this.loadCurrentCrew()
              this.loadEternalToggle()
              this.loadEquipmentCardToggle()
              this.loadWeaponTraitsCardToggle()
              this.loadCombineAllCardsToggle()
              this.loadCurrentCharacters()
            } else {
              this.error = true
            }
          } else {
            this.version = localVersion
            const gameDataString = window.localStorage.getItem('gamedata')
            if (gameDataString) {
              const gameData = JSON.parse(gameDataString)
              this.loaded = true
              this.game_data = gameData
              this.loadCurrentCrew()
              this.loadEternalToggle()
              this.loadEquipmentCardToggle()
              this.loadWeaponTraitsCardToggle()
              this.loadCombineAllCardsToggle()
              this.loadCurrentCharacters()
            } else {
              this.error = true
            }
          }
        } else {
          this.error = true
        }
      } catch (e) {
        console.log(e)
        this.error = true
      }
    }
  },
  methods: {
    openPrintDialog () {
      if (window) {
        window.print()
      }
    },
    searchCharacters(input) {
      if (input.length < 1) { return [] }
      if (!this.characters) { return [] }
      return this.characters.filter(character => {
        return character.alias.toLowerCase()
            .includes(input.toLowerCase()) || character.name.toLowerCase()
            .includes(input.toLowerCase())
      }).sort((a, b) => {
        return a.alias.localeCompare(b.alias)
      })
    },
    searchCrews(input) {
      if (!this.affiliations) { return [] }
      if (input.length < 1) {
        return this.affiliations.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }
      return this.affiliations.filter(crew => {
        return crew.name.toLowerCase()
            .includes(input.toLowerCase())
      }).sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    },
    getResultValue(result) {
      return result
    },
    getCrewResultValue(result) {
      return result.name
    },
    addCharacter (result) {
      if (!this.characters_to_print.includes(result.id)) {
        this.characters_to_print.push(result)
        this.addToSaveData(result)
        if (this.$refs.characterAutocomplete) {
          this.$refs.characterAutocomplete.value = ''
        }
      }
    },
    removeCharacter (character) {
      const existingCharacter = this.characters_to_print.findIndex((characterObject) => {
        return characterObject.id === character.id
      })

      if (existingCharacter !== -1) {
        this.characters_to_print.splice(existingCharacter, 1)
        this.removeFromSaveData(character)
      }
    },
    loadCurrentCharacters () {
      const previousContent = window.localStorage.getItem('characters')

      if (previousContent && this.characters && this.characters.length) {
        const previousContentIds = JSON.parse(previousContent)
        if (previousContentIds && previousContentIds) {
          previousContentIds.forEach((previousContentId) => {
            const existingCharacter = this.characters.findIndex((characterObject) => {
              return characterObject.id === previousContentId
            })

            if (existingCharacter !== -1) {
              this.addCharacter(this.characters[existingCharacter])
            }
          })
        }
      }
    },
    getSaveData () {
      const previousContent = window.localStorage.getItem('characters')

      if (previousContent) {
        return JSON.parse(previousContent)
      } else {
        return []
      }
    },
    addToSaveData (character) {
      const saveData = this.getSaveData()

      const existingCharacter = saveData.findIndex((characterId) => {
        return characterId === character.id
      })

      if (existingCharacter === -1) {
        saveData.push(character.id)
        window.localStorage.setItem('characters', JSON.stringify(saveData))
      }
    },
    removeFromSaveData (character) {
      const saveData = this.getSaveData()

      const existingCharacter = saveData.findIndex((characterId) => {
        return characterId === character.id
      })

      if (existingCharacter !== -1) {
        saveData.splice(existingCharacter, 1)
        window.localStorage.setItem('characters', JSON.stringify(saveData))
      }
    },
    loadCurrentCrew () {
      const previousContent = window.localStorage.getItem('crew')
      if (previousContent && this.affiliations && this.affiliations.length) {
        const previousContentId = parseInt(previousContent)
        const existingCrew = this.affiliations.findIndex((crewObject) => {
          return crewObject.id === previousContentId
        })

        if (existingCrew !== -1) {
          this.crew = this.affiliations[existingCrew]
        }
      }
    },
    selectCrew (crew) {
      this.crew = crew
      window.localStorage.setItem('crew', crew.id)
      const printingCharacters = [...this.characters_to_print]
      for (let i = 0; i < printingCharacters.length; i++) {
        this.removeCharacter(printingCharacters[i])
      }
      this.crewInputExpanded = false
      if (this.$refs.crewAutocomplete) {
        this.$refs.crewAutocomplete.value = ''
      }

      this.$forceUpdate()
    },
    loadEternalToggle() {
      this.eternal = parseInt(window.localStorage.getItem('eternal'))
    },
    toggleEternal () {
      this.eternal = this.eternal === 1 ? 0 : 1
      window.localStorage.setItem('eternal', this.eternal)
    },
    loadEquipmentCardToggle() {
      this.showEquipmentCard = parseInt(window.localStorage.getItem('showEquipmentCard'))
    },
    toggleEquipmentCard () {
      this.showEquipmentCard = this.showEquipmentCard === 1 ? 0 : 1
      window.localStorage.setItem('showEquipmentCard', this.showEquipmentCard)
    },
    loadWeaponTraitsCardToggle() {
      this.showWeaponTraitsCard = parseInt(window.localStorage.getItem('showWeaponTraitsCard'))
    },
    toggleWeaponTraitsCard () {
      this.showWeaponTraitsCard = this.showWeaponTraitsCard === 1 ? 0 : 1
      window.localStorage.setItem('showWeaponTraitsCard', this.showWeaponTraitsCard)
    },
    loadCombineAllCardsToggle() {
      this.combineAllCards = parseInt(window.localStorage.getItem('combineAllCards'))
    },
    toggleCombineAllCards () {
      this.combineAllCards = this.combineAllCards === 1 ? 0 : 1
      window.localStorage.setItem('combineAllCards', this.combineAllCards)
    }
  }
}
</script>

<style>
.character-generator {
  @apply h-full;

  &__error {
    @apply text-2xl;
  }
}
</style>

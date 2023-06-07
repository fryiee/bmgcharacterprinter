<template>
  <div class="character-generator">
    <p v-if="error" class="character-generator__error">
      There was an error getting app data from Knight Models.
    </p>
    <template v-else>
      <div v-if="!loaded" class="flex flex-col noprint p-6">
        <h2 class="text-3xl">Loading...</h2>
      </div>
      <template v-else>
        <div class="flex flex-col noprint mb-20 p-6">
          <h1 class="text-4xl mb-4">Batman Miniature Game Character Printer</h1>
          <h2 v-if="version" class="font-serif text-2xl mb-3">Game Data Version: <strong class="font-sans">{{formattedVersion}} ({{version}})</strong></h2>
          <h2 class="font-serif text-2xl mb-2">Eternal: <input type="checkbox" :value="eternal" :checked="eternal" @input="toggleEternal"/></h2>
          <h2 class="font-serif text-2xl mb-3">Show separate equipment card? <input type="checkbox" :value="showEquipmentCard" :checked="showEquipmentCard" @input="toggleEquipmentCard"/></h2>
          <p v-if="!crew" class="font-serif text-xl mb-6">Select your crew to populate equipment choices.</p>
          <a href="#" @click.prevent="crewInputExpanded = !crewInputExpanded" v-if="crew">
            <h3 class="font-serif text-2xl">Crew: <strong class="font-sans">{{crew.name}}</strong></h3>
          </a>
          <div class="relative z-10">
            <autocomplete v-if="!crew || crewInputExpanded" ref="crewAutocomplete" key="crewAutocompleteField" :search="searchCrews" :get-result-value="getCrewResultValue" @submit="selectCrew" class="mb-8"></autocomplete>
          </div>
          <div class="mt-10 relative z-5" v-if="crew">
            <p class="font-serif text-xl mb-6">Search for characters below and click to add them to your print sheet. Click to remove them.</p>
            <autocomplete :search="searchCharacters" key="characterAutocompleteField" ref="characterAutocomplete" :get-result-value="getResultValue" @submit="addCharacter"></autocomplete>
            <p class="mt-6 font-serif text-lg">Recommended print settings to match KM sized cards: <strong>A4 / Portrait / Scale: 50%</strong></p>
          </div>
        </div>
        <div class="flex flex-col">
          <character :character="character" v-for="character in characters_to_print" :all-selected-characters="characters_to_print" :granted-traits="grantedTraits" :key="character.id" :crew="crew" :version="formattedVersion" :affiliations="affiliations" :traits="traits" :equipment="equipment" :upgrades="upgrades" :weapons="weapons" :show-equipment-card="showEquipmentCard" @click="removeCharacter"></character>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loaded: false,
      error: false,
      game_data: null,
      version: null,
      eternal: 0,
      showEquipmentCard: 0,
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
    try {
      const currentVersionResponse = await axios.get('https://corsproxy.io/?https://app.knightmodels.com/version', {})
      if (currentVersionResponse.status === 200) {
        const currentVersion = currentVersionResponse.data.version.toString()
        const localVersion = window.localStorage.getItem('version')
        if (currentVersion !== localVersion) {
          const gameDataResponse = await axios.get('https://corsproxy.io/?https://app.knightmodels.com/gamedata', {})
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
  },
  methods: {
    searchCharacters(input) {
      if (input.length < 1) { return [] }
      if (!this.characters) { return [] }
      return this.characters.filter(character => {
        return character.alias.toLowerCase()
            .includes(input.toLowerCase()) || character.name.toLowerCase()
            .includes(input.toLowerCase())
      })
    },
    searchCrews(input) {
      if (input.length < 1) { return [] }
      if (!this.affiliations) { return [] }
      return this.affiliations.filter(crew => {
        return crew.name.toLowerCase()
            .includes(input.toLowerCase())
      })
    },
    getResultValue(result) {
      return result.alias + ' [' + result.name + ']'
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
      this.characters_to_print.forEach((character) => {
        this.removeCharacter(character)
      })
      this.crewInputExpanded = false
      if (this.$refs.crewAutocomplete) {
        this.$refs.crewAutocomplete.value = ''
      }
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
    }
  }
}
</script>

<style>
.character-generator {
  @apply h-full;

  .character {
    @apply mb-12;
  }
}
</style>

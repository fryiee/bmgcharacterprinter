<template>
  <div class="character-generator">
    <p v-if="error" class="character-generator__error">
      There was an error getting app data from Knight Models.
    </p>
    <div v-else>
      <div v-if="!loaded" class="flex flex-col p-6">
        <h2 class="text-3xl">Loading...</h2>
      </div>
      <div v-else>
        <div class="flex flex-col noprint mb-20 p-6">
          <h1 class="text-4xl mb-4">Batman Miniature Game Character Printer</h1>
          <h2 class="font-serif text-2xl mb-8">Game Data Version: <strong class="font-sans">{{version}}</strong></h2>
          <p class="font-serif text-xl mb-6">Search for characters below and click to add them to your print sheet. Click to remove them.</p>
          <autocomplete :search="search" :get-result-value="getResultValue" @submit="addCharacter"></autocomplete>
        </div>
        <div class="flex flex-col">
          <character :character="character" v-for="character in characters_to_print" :key="character.id" :affiliations="affiliations" :traits="traits" :equipment="equipment" :upgrades="upgrades" :weapons="weapons" @click="removeCharacter"></character>
        </div>
      </div>
    </div>
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
      characters_to_print: []
    }
  },
  computed: {
    affiliations() {
      if (!this.game_data || !this.game_data.affiliations) {
        return []
      } else {
        return this.game_data.affiliations
      }
    },
    characters() {
      if (!this.game_data || !this.game_data.characters) {
        return []
      } else {
        return this.game_data.characters
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
            console.log(gameData)
            this.loadCurrentCharacters()
          } else {
            this.error = true
          }
        }
      } else {
        this.error = true
      }
    } catch (e) {
      this.error = true
    }
  },
  methods: {
    search(input) {
      if (input.length < 1) { return [] }
      return this.game_data.characters.filter(character => {
        return character.alias.toLowerCase()
            .includes(input.toLowerCase())
      })
    },
    getResultValue(result) {
      return result.alias
    },
    addCharacter (result) {
      if (!this.characters_to_print.includes(result.id)) {
        this.characters_to_print.push(result)
        this.addToSaveData(result)
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

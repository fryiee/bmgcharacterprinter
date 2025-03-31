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
            <h1 class="text-4xl mb-1">Batman Miniature Game Compendium Viewer</h1>
            <h5 v-if="version" class="font-sans text-sm">Game Data Version: {{formattedVersion}} ({{version}})</h5>
            <h4 v-if="localOnly" class="font-sans text-lg text-red-800">LOCAL GAME DATA ONLY (No imagery)</h4>
          </div>
        </div>
        <div class="flex flex-col noprint mb-6 p-6">
          <input type="text" v-model="traitSearch" placeholder="Search for a trait name..." name="search" class="rounded-sm border px-6 py-3 border-gray-600"/>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 lg:grid-cols-3 gap-8 px-8 my-8">
          <div v-for="trait in filteredTraits" class="border border-black p-2">
            <h3 class="font-bold text-2xl" v-html="renderedTraitText(trait.name)"></h3>
            <p class="font-serif" v-html="renderedTraitText(trait.description)"></p>
          </div>
        </div>
        </template>
      </template>
    </div>
</template>

<script>
import axios from "axios";

const localGameData = require('../gameData.json')

export default {
  name: 'Compendium',
  data() {
    return {
      icons: [
        'aff_amazons_icon',
        'aff_bane_icon',
        'aff_batman_icon',
        'aff_birds_icon',
        'aff_ccv_icon',
        'aff_crime_icon',
        'aff_joker_icon',
        'aff_league_icon',
        'aff_militia_icon',
        'aff_mrfreeze_icon',
        'aff_owls_icon',
        'aff_penguin_icon',
        'aff_poison_icon',
        'aff_riddler_icon',
        'aff_twoface_icon',
        'aff_unknown_icon',
        'aff_law_forces_icon',
        'aff_royal_flush_icon',
        'aff_cults_blackfire_icon',
        'aff_batman_who_laughs_icon',
        'aff_cults_kobra_icon',
        'aff_harley_quinn_friends_icon',
        'aff_scarecrow_icon',
        'aff_suicide_squad_icon',
        'aff_vigilantes_icon',
        'aff_vigilantes_batfamily_icon',
        'aff_vigilantes_teen_titans_icon',
        'aff_watchmen_icon',
        'ammo_icon',
        'audacity_0_icon',
        'audacity_1_icon',
        'background_attack',
        'background_defense',
        'background_endurance',
        'background_movement',
        'background_special',
        'background_strength',
        'background_willpower',
        'batclaw_icon',
        'blood_icon',
        'blood',
        'card',
        'clock_black_24dp',
        'crown_icon',
        'eff_blind_icon',
        'eff_cooled_icon',
        'eff_enerv1_icon',
        'eff_enerv2_icon',
        'eff_enerv3_icon',
        'eff_fire_icon',
        'eff_freeze_icon',
        'eff_paralize_icon',
        'eff_poison1_icon',
        'eff_poison2_icon',
        'eff_poison3_icon',
        'eff_poison4_icon',
        'eff_scared_icon',
        'eff_stunned_icon',
        'eff_terror1_icon',
        'eff_terror2_icon',
        'eff_terror3_icon',
        'event_icon',
        'faith_icon',
        'grey_form',
        'injury',
        'interrog_icon',
        'kd_icon',
        'keyboard_black_24dp',
        'ko_icon',
        'less_att_icon',
        'less_def_icon',
        'login_icon',
        'magazine_icon',
        'mov_2_icon',
        'mov_4_icon',
        'mov_6_icon',
        'mov_minus_2_icon',
        'mov_minus_4_icon',
        'mov_minus_6_icon',
        'mtrl_checked_circle',
        'mtrl_chip_checked_black',
        'mtrl_chip_checked_circle',
        'mtrl_chip_close_circle',
        'none_icon',
        'ot_control_icon',
        'ot_menace_icon',
        'ot_protection_icon',
        'ot_violence_icon',
        'phase_i_icon',
        'phase_ii_icon',
        'phase_iii_icon',
        'phase_iv_icon',
        'plus_att_icon',
        'plus_def_icon',
        'rank_freeagent',
        'rank_henchman',
        'rank_leader',
        'rank_legend',
        'rank_sidekick',
        'rank_vehicle',
        'rank_freeagent_icon',
        'rank_henchman_icon',
        'rank_leader_icon',
        'rank_legend_icon',
        'rank_sidekick_icon',
        'rank_vehicle_icon',
        'resource_icon',
        'rof_icon',
        'special_icon',
        'strength_icon',
        'stun',
        'stun_icon',
        'target_icon',
        'tick_icon',
        'wing_icon',
        'wts_instant_icon',
        'wts_round_icon',
        'wts_special_icon',
        'yellow_polygon',
        'yellow_separator',
      ],
      loaded: false,
      localOnly: true,
      error: false,
      game_data: null,
      version: null,
      traitSearch: null,
    }
  },
  computed: {
    formattedVersion() {
      const date = new Date(parseInt(this.version) * 1000)
      return 'v.' + date.getUTCFullYear().toString() + '-' + (date.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + date.getUTCDate().toString().padStart(2, '0')
    },
    filteredTraits() {
      if (!this.game_data) {
        return []
      }

      if (!this.traitSearch || this.traitSearch === '') {
        return [...this.game_data.traits].sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      } else {
        return [...this.game_data.traits].filter(trait => trait.name.toLowerCase().includes(this.traitSearch.toLowerCase())).sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }
    }
  },
  methods: {
    renderedTraitText(traitDescription) {
      return this.renderIcons(traitDescription)
    },

    renderIcons (text) {
      let alteredText = text
      alteredText = alteredText
          .replaceAll('{+', '{PLUS_')
          .replaceAll('{-', '{LESS_')
          .replaceAll('-2MOV', '{MOV_MINUS_2_ICON}')
          .replaceAll('-4MOV', '{MOV_MINUS_4_ICON}')
          .replaceAll('-6MOV', '{MOV_MINUS_6_ICON}')
          .replaceAll('+2MOV', '{MOV_2_ICON}')
          .replaceAll('+4MOV', '{MOV_4_ICON}')
          .replaceAll('+6MOV', '{MOV_6_ICON}')
          .replaceAll('MOV+2', 'MOV_2')
          .replaceAll('MOV+4', 'MOV_4')
          .replaceAll('MOV+6', 'MOV_6')
          .replaceAll('MOV-2', 'MOV_MINUS_2')
          .replaceAll('MOV-4', 'MOV_MINUS_4')
          .replaceAll('MOV-6', 'MOV_MINUS_6')
      this.icons.forEach((icon) => {
        const uppercaseIcon = icon.toUpperCase()
        if (alteredText.includes('{' + uppercaseIcon + '}')) {
          alteredText = alteredText.replaceAll('{' + uppercaseIcon + '}', '<img src="dist/img/icons/' + icon + '.svg" alt="' + icon + ' icon" class="inline h-6 w-auto"/>')
        }
      })

      return alteredText
    },
  },
  async mounted() {
    if (this.localOnly) {
      const gameData = localGameData.data
      window.localStorage.setItem('gamedata', JSON.stringify(gameData))
      window.localStorage.setItem('version', localGameData.version)
      this.version = localGameData.version
      this.loaded = true
      this.game_data = gameData
      console.log('test')
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
  }
}
</script>

<style>
.compendium {
  @apply flex flex-col;
}
</style>

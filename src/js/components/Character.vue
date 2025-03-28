<template>
  <div class="character">
    <a href="#" @click.prevent="toggleExpand" :class="'w-full noprint px-6 py-2 bg-yellow-400 flex items-center justify-start border-b-2 border-black'+(index === 1 ? ' border-t-2' : '')">
      <font-awesome-icon icon="chevron-down" size="lg" :class="expanded ? 'transform rotate-180' : ''"></font-awesome-icon>
      <h2 class="text-3xl font-sans ml-2 mb-0 max-w-8xl leading-none overflow-ellipsis overflow-hidden whitespace-nowrap">{{index}}. {{character.alias}} [{{character.name}}]</h2>
      <div v-if="determinedSizingAtLeastOnce === false" class="ml-auto inline-flex items-center justify-end notification-row">
        <h2 class="text-lg leading-none text-right font-sans text-red-500 mr-2">This character card hasn't been sized. Expand the character at least once.</h2>
        <font-awesome-icon icon="times-circle" class="text-red-500 fill-current" size="lg"></font-awesome-icon>
      </div>
    </a>

    <div :class="'character__expander'+(expanded ? ' character__expander--expanded' : '')">
      <div class="flex flex-col character__card__container">
        <a href="#" @click.prevent="$emit('click', character)" class="character__card" :style="backgroundStyle">
          <span :class="'character__card__version'+(localOnly ? ' character__card__version--local' : '')">{{version}}&nbsp;&copy;{{nowYear}} Knight Models.</span>
          <div class="character__card__banner">
            <div class="character__card__banner__name">
              <h4>{{character.alias}}</h4>
              <h5>{{character.name}} / {{character.bases_size}}</h5>
            </div>
            <div class="character__card__banner__pod">
              <small class="character__card__banner__pod__title">Rank</small>
              <div class="character__card__banner__pod__images">
                <img v-for="rank in characterRanks" :key="character.id+'-'+'rank-'+rank.id" :alt="rank.icon" :src="'dist/img/icons/' + rank.icon + '.svg'"/>
              </div>
            </div>
            <div class="character__card__banner__pod">
              <small class="character__card__banner__pod__title">Aff</small>
              <div class="character__card__banner__pod__images">
                <div v-for="affiliation in characterAffiliations" :key="character.id+'-'+'affiliation-'+affiliation.id" :class="(localOnly ? 'character__card__banner__pod__image' : 'character__card__banner__pod__image--dark')+' img'" :style="'background-image:url('+(localOnly ? getIconFromAffiliation(affiliation) : affiliation.icon)+');'"></div>
              </div>
            </div>
            <div class="character__card__banner__pod">
              <small class="character__card__banner__pod__title">Riv</small>
              <div class="character__card__banner__pod__images">
                <div v-for="affiliation in characterRivals" :key="character.id+'-'+'rival-'+affiliation.id" :class="(localOnly ? 'character__card__banner__pod__image' : 'character__card__banner__pod__image--dark')+' img'" :style="'background-image:url('+(localOnly ? getIconFromAffiliation(affiliation) : affiliation.icon)+');'"></div>
              </div>
            </div>
            <div class="character__card__banner__pod character__card__banner__pod--col character__card__banner__pod--center">
              <span class="character__card__banner__pod__text">{{character.reputation}} rep</span>
              <span class="character__card__banner__pod__text">{{character.funding}} $</span>
            </div>
          </div>

          <div class="character__card__stats">
            <div class="character__card__stats__damage">
              <div class="character__card__stats__damage__pod">
                <img src="dist/img/icons/background_willpower.svg" alt="background_willpower icon" class="character__card__stats__damage__pod__image"/>
                <h3>{{character.willpower}}</h3>
                <h4>Willpower</h4>
              </div>

              <div class="character__card__stats__damage__pod character__card__stats__damage__pod--dark">
                <img src="dist/img/icons/background_endurance.png" alt="background_endurance icon" class="character__card__stats__damage__pod__image"/>
                <h3>{{character.endurance}}</h3>
                <h4>Endurance</h4>
              </div>
            </div>

            <div class="character__card__stats__row character__card__stats__row--1">
              <div class="character__card__stats__row__pod">
                <img src="dist/img/icons/background_attack.svg" alt="background_attack icon"/>
                <span>{{character.attack}}</span>
              </div>
              <div class="character__card__stats__row__pod">
                <img src="dist/img/icons/background_defense.svg" alt="background_defense icon"/>
                <span>{{character.defense}}</span>
              </div>
            </div>
            <div class="character__card__stats__row character__card__stats__row--2">
              <div class="character__card__stats__row__pod">
                <img src="dist/img/icons/background_strength.svg" alt="strength icon"/>
                <span>{{character.strength}}+</span>
              </div>
              <div class="character__card__stats__row__pod">
                <img src="dist/img/icons/background_movement.svg" alt="movement icon"/>
                <span>{{character.movement}}</span>
              </div>
            </div>
          </div>

          <div class="character__card__middle__banner">
            <div v-for="weapon in characterWeaponsWithTraitNames" :key="character.id+'-'+'weapon-'+weapon.id" class="character__card__middle__banner__row">
              <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__title">{{weapon.name}}</span>
              <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__damage">
              <template v-if="weapon.damage">
              <img v-for="(damage, index) in weaponDamage(weapon)" :key="character.id+'-'+damage.icon+'-'+index" :alt="damage.icon" :src="'dist/img/icons/' + damage.icon + '.svg'"/>
              </template>
              <template v-else>-</template>
            </span>
              <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__rof">
              <template v-if="weapon.rate_of_fire">
                <span>{{weapon.rate_of_fire}}&nbsp;</span><img src="dist/img/icons/yellow_rof_icon.svg" alt="ROF icon"/>
              </template>
              <template v-else><span>-</span></template>
            </span>
              <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__ammo">
              <template v-if="weapon.ammunition">
                <span>{{weapon.ammunition}}&nbsp;</span><img src="dist/img/icons/yellow_ammo_icon.svg" alt="Ammo icon"/>
              </template>
              <template v-else><span>-</span></template>
            </span>
              <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__traits">{{weapon.trait_names.join(' / ')}}</span>
            </div>
          </div>

          <div class="character__card__bottom__banner">
            <span class="character__card__bottom__banner__tag" v-html="renderIcons(trait.name)" v-for="trait in characterTraits"></span>
          </div>
        </a>
      </div>
      <div class="character__card bg-white border border-black noprint">
        <div class="character__options">
          <h4 class="text-3xl mb-2">Equipment</h4>
          <span v-for="equipment in availableEquipment" class="text-lg leading-none mb-1 whitespace-nowrap">
            <input type="checkbox" :value="equipment.id" @input="toggleEquipment(equipment.id)" class="w-5 h-5"/>&nbsp;{{equipment.name}} (<span>{{equipment.reputation}} rep</span> - <span>{{equipment.funding}} $)</span>
          </span>
          <template v-if="loading">
            <hr class="my-4 border-black px-4">
            <div class="flex items-center justify-start">
              <font-awesome-icon icon="spinner" size="2x" class="animate-spin fill-current text-black"></font-awesome-icon>
              <h4 class="ml-4 text-3xl">Configuring card size...</h4>
            </div>
          </template>
        </div>
      </div>
      <a ref="traitHeightDeterminer" href="#" @click.prevent="$emit('click', character)" class="character__card character__card__height-determiner bg-white border border-black">
        <p :class="'character__card__row'+(trait.added ? ' character__card__row--added' : '')" :key="character.id+'-'+'trait-'+trait.id" v-for="trait in characterTraits" :style="'font-size: '+currentTraitFontSize+'px'">
          <strong v-if="trait.added">+&nbsp;</strong><span class="font-sans" v-html="renderIcons(trait.name)"></span><span>:&nbsp;</span><span v-html="renderIcons(trait.description)"></span>
        </p>
      </a>
      <a ref="weaponTraitHeightDeterminer" v-if="characterWeaponTraits && characterWeaponTraits.length && showWeaponTraitsCard === 1" href="#" @click.prevent="$emit('click', character)" class="character__card character__card__height-determiner bg-white border border-black">
        <p :class="'character__card__row'+(trait.added ? ' character__card__row--added' : '')" :key="character.id+'-'+'weapontrait-'+trait.id" v-for="trait in characterWeaponTraits" :style="'font-size: '+currentWeaponTraitFontSize+'px'">
          <strong v-if="trait.added">+&nbsp;</strong><span class="font-sans" v-html="renderIcons(trait.name)"></span><span>:&nbsp;</span><span v-html="renderIcons(trait.description)"></span>
        </p>
      </a>
      <a ref="equipmentHeightDeterminer" v-if="characterEquipment && characterEquipment.length && showEquipmentCard === 1" href="#" @click.prevent="$emit('click', character)" class="character__card character__card__height-determiner bg-white border border-black">
        <p :class="'character__card__row'+(equipment.added ? ' character__card__row--added' : '')" :key="character.id+'-'+'equipment-'+equipment.id" v-for="equipment in characterEquipment" :style="'font-size: '+currentEquipmentFontSize+'px'">
          <strong v-if="equipment.added">+&nbsp;</strong><span class="font-sans" v-html="renderIcons(equipment.name)"></span><span>:&nbsp;</span><span v-html="renderIcons(equipment.description)"></span>
        </p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Character',
  props: ['character', 'index', 'affiliations', 'localOnly', 'traits', 'equipment', 'upgrades', 'weapons', 'crew', 'version', 'eternal', 'showEquipmentCard', 'showWeaponTraitsCard', 'combineAllCards', 'allSelectedCharacters', 'grantedTraits'],
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
      localAffiliationMapping: [
        {
          "id": 3,
          "icon": "law_forces"
        },
        {
          "id": 4,
          "icon": "harley_quinn_friends"
        },
        {
          "id": 5,
          "icon": "vigilantes"
        },
        {
          "id": 6,
          "icon": "doom_patrol"
        },
        {
          "id": 7,
          "icon": "joker"
        },
        {
          "id": 8,
          "icon": "cults"
        },
        {
          "id": 9,
          "icon": "league"
        },
        {
          "id": 10,
          "icon": "mrfreeze"
        },
        {
          "id": 11,
          "icon": "crime"
        },
        {
          "id": 12,
          "icon": "penguin"
        },
        {
          "id": 13,
          "icon": "riddler"
        },
        {
          "id": 14,
          "icon": "bane"
        },
        {
          "id": 15,
          "icon": "suicide_squad"
        },
        {
          "id": 18,
          "icon": "batman_who_laughs"
        },
        {
          "id": 19,
          "icon": ""
        },
        {
          "id": 20,
          "icon": "owls"
        },
        {
          "id": 22,
          "icon": "twoface"
        },
        {
          "id": 23,
          "icon": "unknown"
        },
        {
          "id": 24,
          "icon": "watchmen"
        },
        {
          "id": 25,
          "icon": "scarecrow"
        },
        {
          "id": 27,
          "icon": "royal_flush"
        }
      ],
      ranks: [
        {
          id: 1,
          icon: 'rank_leader'
        },
        {
          id: 2,
          icon: 'rank_sidekick'
        },
        {
          id: 3,
          icon: 'rank_freeagent'
        },
        {
          id: 5,
          icon: 'rank_henchman'
        },
        {
          id: 4,
          icon: 'rank_vehicle'
        },
        {
          id: 6,
          icon: 'rank_legend'
        },
      ],
      damage: [
        {
          id: 1,
          icon: 'blood'
        },
        {
          id: 2,
          icon: 'stun'
        }
      ],
      selectedEquipment: [],
      expanded: false,
      lowerFontSizeLimit: 12,
      upperFontSizeLimit: 22,
      currentTraitFontSize: 12,
      currentWeaponTraitFontSize: 12,
      currentEquipmentFontSize: 12,
      useMultipleTraitCards: false,
      excludedTraitCards: [],
      useMultipleWeaponTraitCards: false,
      excludedWeaponTraitCards: [],
      useMultipleEquipmentCards: false,
      excludedEquipmentCards: [],
      useMultipleCombinedCards: false,
      combinedCards: [],
      loading: false,
      determinedSizingAtLeastOnce: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.configureSingleCardSize('traitHeightDeterminer', 'currentTraitFontSize')
      if (this.showWeaponTraitsCard) {
        this.configureSingleCardSize('weaponTraitHeightDeterminer', 'currentWeaponTraitFontSize')
      }

      if (this.showEquipmentCard) {
        this.configureSingleCardSize('equipmentHeightDeterminer', 'currentEquipmentFontSize')
      }

      if (this.determinedSizingAtLeastOnce === false) {
        this.determinedSizingAtLeastOnce = true
      }
    }, 100)
  },
  watch: {
    showEquipmentCard: {
      handler: function (val, oldVal) {
        setTimeout(() => {
          this.configureSingleCardSize('traitHeightDeterminer', 'currentTraitFontSize')
          this.configureSingleCardSize('weaponTraitHeightDeterminer', 'currentWeaponTraitFontSize')
          this.configureSingleCardSize('equipmentHeightDeterminer', 'currentEquipmentFontSize')
        }, 100)
      },
      immediate: true,
      deep: true
    },
    showWeaponTraitsCard: {
      handler: function (val, oldVal) {
        setTimeout(() => {
          this.configureSingleCardSize('traitHeightDeterminer', 'currentTraitFontSize')
          this.configureSingleCardSize('weaponTraitHeightDeterminer', 'currentWeaponTraitFontSize')
          this.configureSingleCardSize('equipmentHeightDeterminer', 'currentEquipmentFontSize')
        }, 100)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    backgroundStyle() {
      return 'background-image:url("' + (this.localOnly ? 'dist/img/local_background.jpg' : this.character.background) + '");'
    },
    nowYear () {
      return (new Date()).getUTCFullYear().toString()
    },
    characterAffiliations() {
      if (!this.character.affiliations || this.character.affiliations.length === 0) {
        return []
      } else {
        const affiliations = []

        this.character.affiliations.forEach((affiliation) => {
          for (let i = 0; i < this.affiliations.length; i++) {
            let existingAffiliation = {...this.affiliations[i]}

            if (existingAffiliation.id === affiliation.affiliation_id) {
              affiliations.push(existingAffiliation)
            }
          }
        })

        return affiliations
      }
    },
    characterRivals() {
      if (!this.character.rival_affiliation_ids || this.character.rival_affiliation_ids.length === 0) {
        return []
      } else {
        const affiliations = []

        this.character.rival_affiliation_ids.forEach((affiliation) => {
          for (let i = 0; i < this.affiliations.length; i++) {
            let existingAffiliation = {...this.affiliations[i]}

            if (existingAffiliation.id === affiliation) {
              affiliations.push(existingAffiliation)
            }
          }
        })

        return affiliations
      }
    },
    characterTraits() {
      if (!this.character.traits || this.character.traits.length === 0) {
        return []
      } else {
        let traits = []

        this.character.traits.forEach((trait) => {
          for (let i = 0; i < this.traits.length; i++) {
            let existingTrait = {...this.traits[i]}

            if (existingTrait.id === trait.trait_id && (traits.findIndex(previousTrait => previousTrait.id === trait.trait_id) === -1)) {
              if (trait.alternate_name !== null) {
                existingTrait.name = trait.alternate_name
              }
              traits.push(existingTrait)
            }
          }
        })

        if (this.grantedTraits && this.grantedTraits.length) {
          for (let i = 0; i < this.grantedTraits.length; i++) {
            const existingGrantedTrait = {...this.grantedTraits[i]}
            const existingRankIndex = this.characterRanks.findIndex(characterRank => characterRank.id === existingGrantedTrait.rank)

            if (existingRankIndex !== -1) {
              const existingTraitIndex = this.traits.findIndex(currentTrait => currentTrait.id === existingGrantedTrait.id)

              if (existingTraitIndex !== -1) {
                const existingTrait = {...this.traits[existingTraitIndex]}
                existingTrait.added = true
                traits.push(existingTrait)
              }
            }
          }
        }

        this.characterEquipment.forEach((equipment) => {
          if (equipment.traits.length) {
            equipment.traits.forEach((trait) => {
              for (let i = 0; i < this.traits.length; i++) {
                let existingTrait = {...this.traits[i]}

                if (existingTrait.id === trait.trait_id && (traits.findIndex(previousTrait => previousTrait.id === trait.trait_id) === -1)) {
                  if (trait.alternate_name !== null) {
                    existingTrait.name = trait.alternate_name
                  }
                  existingTrait.added = true
                  traits.push(existingTrait)
                }
              }
            })
          }
        })

        return traits.sort((trait1, trait2) => {
          return trait1.name.localeCompare(trait2.name)
        })
      }
    },
    excludableCharacterTraits () {
      if (!this.characterTraits || this.characterTraits.length === 0) {
        return []
      } else {
        let traits = [...this.characterTraits]

        if (this.excludedTraitCards.length) {
          traits = traits.filter((filteredTrait) => {
            return this.excludedTraitCards.findIndex(excludedTrait => excludedTrait.id === filteredTrait.id) === -1
          })
        }

        return traits
      }
    },
    availableEquipment() {
      if (!this.equipment || this.equipment.length === 0) {
        return []
      } else {
        const availableEquipment = []

        this.equipment.forEach((equipment) => {
          let canAdd = true

          // check banned characters
          if (equipment.banned_character_ids.includes(this.character.id)) {
            canAdd = false
          }

          // check required affiliations
          if (equipment.required_affiliation_ids.length) {
            let isCrew = false

            if (equipment.required_affiliation_ids.includes(this.crew.id)) {
              isCrew = true
            }

            if (!isCrew) {
              canAdd = false
            }
          }

          // check required ranks
          if (equipment.required_rank_ids.length) {
            let inRank = false
            this.character.rank_ids.forEach((rankId) => {
              if (equipment.required_rank_ids.includes(rankId)) {
                inRank = true
              }
            })

            if (!inRank) {
              canAdd = false
            }
          }

          // check required character ids
          if (equipment.required_character_ids.length) {
            let isCharacter = false

            if (equipment.required_character_ids.includes(this.character.id)) {
              isCharacter = true
            } else {
              for (let i = 0; i < this.allSelectedCharacters.length; i++) {
                const existingCharacter = this.allSelectedCharacters[i]

                if (equipment.required_character_ids.includes(existingCharacter.id)) {
                  isCharacter = true
                }
              }
            }

            if (!isCharacter) {
              canAdd = false
            }
          }

          if (canAdd) {
            availableEquipment.push(equipment)
          }
        })

        return availableEquipment.sort((equip1, equip2) => equip1.name.localeCompare(equip2.name))
      }
    },
    characterEquipment() {
      if (!this.selectedEquipment || this.selectedEquipment.length === 0) {
        return []
      } else {
        let equipment = []
        const selectedEquipments = [...this.selectedEquipment]

        selectedEquipments.forEach((selectedEquipment) => {
          for (let i = 0; i < this.equipment.length; i++) {
            let existingEquipment = {...this.equipment[i]}

            if (existingEquipment.id === selectedEquipment.id) {
              equipment.push(existingEquipment)
            }
          }
        })

        if (this.excludedEquipmentCards.length) {
          equipment = equipment.filter((filteredEquipment) => {
            return this.excludedEquipmentCards.findIndex(excludedTrait => excludedTrait.id === filteredEquipment.id) === -1
          })
        }

        return equipment
      }
    },
    characterUpgrades() {
      if (!this.character.upgrade_ids || this.character.upgrade_ids.length === 0) {
        return []
      } else {
        const upgrades = []

        this.character.upgrade_ids.forEach((upgrade_id) => {
          for (let i = 0; i < this.upgrades.length; i++) {
            let existingUpgrade = {...this.upgrades[i]}

            if (existingUpgrade.id === upgrade_id) {
              upgrades.push(existingUpgrade)
            }
          }
        })

        return upgrades
      }
    },
    characterRanks() {
      if (!this.character.rank_ids || this.character.rank_ids.length === 0) {
        return []
      } else {
        const ranks = []

        this.character.rank_ids.forEach((rank_id) => {
          for (let i = 0; i < this.ranks.length; i++) {
            let existingRank = this.ranks[i]

            if (existingRank.id === rank_id) {
              ranks.push(existingRank)
            }
          }
        })

        return ranks
      }
    },
    characterWeapons() {
      if (!this.character.weapon_ids || this.character.weapon_ids.length === 0) {
        return []
      } else {
        const weapons = []

        this.character.weapon_ids.forEach((weapon_id) => {
          for (let i = 0; i < this.weapons.length; i++) {
            let existingWeapon = {...this.weapons[i]}

            if (existingWeapon.id === weapon_id) {
              weapons.push(existingWeapon)
            }
          }
        })

        this.characterEquipment.forEach((equipment) => {
          if (equipment.granted_weapon_id) {
            for (let i = 0; i < this.weapons.length; i++) {
              let existingWeapon = {...this.weapons[i]}

              if (existingWeapon.id === equipment.granted_weapon_id) {
                weapons.push(existingWeapon)
              }
            }
          }
        })

        return weapons
      }
    },
    characterWeaponsWithTraitNames () {
      if (!this.characterWeapons || this.characterWeapons.length === 0) {
        return []
      } else {
        const characterWeapons = [...this.characterWeapons]
        const weaponsWithTraits = []
        for (let i = 0; i < characterWeapons.length; i++) {
          const traits = []
          const characterWeapon = characterWeapons[i]


          characterWeapon.traits.forEach((trait) => {
            for (let i = 0; i < this.traits.length; i++) {
              let existingTrait = {...this.traits[i]}

              if (existingTrait.id === trait.trait_id && (traits.findIndex(traitObject => traitObject.id === trait.trait_id) === -1)) {
                if (trait.alternate_name !== null) {
                  existingTrait.name = trait.alternate_name
                }
                traits.push(existingTrait)
              }
            }
          })

          characterWeapon.trait_names = traits.sort((trait1, trait2) => {
            return trait1.name.localeCompare(trait2.name)
          }).map((trait) => {
            return trait.name
          })

          weaponsWithTraits.push(characterWeapon)
        }

        return weaponsWithTraits
      }
    },
    characterWeaponTraits () {
      if (!this.characterWeapons || this.characterWeapons.length === 0) {
        return []
      } else {
        let traits = []
        const characterWeapons = [...this.characterWeapons]

        characterWeapons.forEach((characterWeapon) => {
          characterWeapon.traits.forEach((trait) => {
            for (let i = 0; i < this.traits.length; i++) {
              let existingTrait = {...this.traits[i]}

              if (existingTrait.id === trait.trait_id && (traits.findIndex(traitObject => traitObject.id === trait.trait_id) === -1)) {
                if (trait.alternate_name !== null) {
                  existingTrait.name = trait.alternate_name
                }
                traits.push(existingTrait)
              }
            }
          })
        })

        if (this.excludedWeaponTraitCards.length) {
          traits = traits.filter((filteredTrait) => {
            return this.excludedWeaponTraitCards.findIndex(excludedTrait => excludedTrait.id === filteredTrait.id) === -1
          })
        }

        return traits.sort((trait1, trait2) => {
          return trait1.name.localeCompare(trait2.name)
        })
      }
    }
  },
  methods: {
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
          alteredText = alteredText.replaceAll('{' + uppercaseIcon + '}', '<img src="dist/img/icons/' + icon + '.svg" alt="' + icon + ' icon"/>')
        }
      })

      return alteredText
    },
    getIconFromAffiliation(affiliation)
    {
      let affiliationIndex = this.localAffiliationMapping.findIndex(affiliationIcon => affiliationIcon.id === affiliation.id)

      if (affiliationIndex !== -1) {
        return 'dist/img/icons/aff_' + this.localAffiliationMapping[affiliationIndex].icon + '_icon.svg';
      } else {
        return false;
      }
    },
    weaponDamage (weapon) {
      if (!weapon.damage || weapon.damage.length === 0) {
        return []
      } else {
        const damages = []

        weapon.damage.forEach((damage) => {
          const damageTypeIndex = this.damage.findIndex((damageType) => damageType.id === damage.damage_type_id)

          if (damageTypeIndex !== -1) {
            for (let i = 0; i < damage.count; i++) {
              damages.push(this.damage[damageTypeIndex])
            }
          }
        })

        return damages
      }
    },
    toggleEquipment(equipmentId) {
      const existingEquipmentId = this.selectedEquipment.findIndex(selectedEquipment => selectedEquipment.id === equipmentId)

      if (existingEquipmentId !== -1) {
        this.selectedEquipment.splice(existingEquipmentId, 1)
      } else {
        const equipmentIndex = this.equipment.findIndex(equipment => equipment.id === equipmentId)
        this.selectedEquipment.push(this.equipment[equipmentIndex])
      }

      setTimeout(() => {
        this.configureSingleCardSize('traitHeightDeterminer', 'currentTraitFontSize')
        if (this.showWeaponTraitsCard) {
          this.configureSingleCardSize('weaponTraitHeightDeterminer', 'currentWeaponTraitFontSize')
        }

        if (this.showEquipmentCard) {
          this.configureSingleCardSize('equipmentHeightDeterminer', 'currentEquipmentFontSize')
        }

        if (this.determinedSizingAtLeastOnce === false) {
          this.determinedSizingAtLeastOnce = true
        }
      }, 100)
    },
    async configureCombinedCardSizes () {
      /*
      @todo actually make combined work
      this.useMultipleCombinedCards = false
      this.combinedCards = []
      this.excludedEquipmentCards = []
      this.excludedWeaponTraitCards = []
      this.excludedTraitCards = []

      this.loading = true
      this.currentFontSize = this.upperFontSizeLimit
      await this.$nextTick()

      // we know height is fixed to 496.
      let currentHeight = this.$refs.heightDeterminer.scrollHeight
      let cardNumber = currentHeight / 496
      while (this.currentFontSize > this.lowerFontSizeLimit && cardNumber > 1) {
        this.currentFontSize = this.currentFontSize - 1
        await this.$nextTick()
        currentHeight = this.$refs.heightDeterminer.scrollHeight
        cardNumber = currentHeight / 496
      }

      if (cardNumber > 1.0) {
        const extraCardsNeeded = Math.ceil(cardNumber - 1.0)
        for (let i = 1; i <= extraCardsNeeded; i++) {
          this.combinedCards.push([])
        }

        let allTraits = [...this.characterTraits]
        let allWeaponTraits = [...this.characterWeaponTraits]
        let allEquipment = [...this.characterEquipment]

        if (this.showEquipmentCard) {
          while (cardNumber > 1.0 && allEquipment.length > 0) {
            const lastElement = allEquipment.pop()
            let shouldPush = true
            for (let i = extraCardsNeeded - 1; i >= 0; i--) {
              if (this.combinedCards[i].length < 8 && shouldPush) {
                shouldPush = false
                this.combinedCards[i].push(lastElement)
              }
            }
            this.excludedEquipmentCards.push(lastElement)
            await this.$nextTick()

            currentHeight = this.$refs.heightDeterminer.scrollHeight
            cardNumber = currentHeight / 496
          }
        }

        if (this.showWeaponTraitsCard) {
          while (cardNumber > 1.0 && allWeaponTraits.length > 0) {
            const lastElement = allWeaponTraits.pop()
            let shouldPush = true
            for (let i = extraCardsNeeded - 1; i >= 0; i--) {
              if (this.combinedCards[i].length < 8 && shouldPush) {
                shouldPush = false
                this.combinedCards[i].push(lastElement)
              }
            }
            this.excludedWeaponTraitCards.push(lastElement)
            await this.$nextTick()

            currentHeight = this.$refs.heightDeterminer.scrollHeight
            cardNumber = currentHeight / 496
          }
        }

        while (cardNumber > 1.0 && allTraits.length > 0) {
          const lastElement = allTraits.pop()
          let shouldPush = true
          for (let i = extraCardsNeeded - 1; i >= 0; i--) {
            if (this.combinedCards[i].length < 8 && shouldPush) {
              shouldPush = false
              this.combinedCards[i].push(lastElement)
            }
          }
          this.excludedTraitCards.push(lastElement)
          await this.$nextTick()

          currentHeight = this.$refs.heightDeterminer.scrollHeight
          cardNumber = currentHeight / 496
        }

        for (let i = extraCardsNeeded - 1; i >= 0; i--) {
          this.combinedCards[i] = this.combinedCards[i].reverse()
        }
      }

      this.loading = false
      await this.$nextTick()

       */
    },
    async configureSingleCardSize(ref, currentFontSizeProperty) {
      if (this.$refs[ref]) {
        this.loading = true
        this[currentFontSizeProperty] = this.upperFontSizeLimit
        await this.$nextTick()

        // we know height is fixed to 496.
        let currentHeight = this.$refs[ref].scrollHeight
        let cardNumber = currentHeight / 496
        while (this[currentFontSizeProperty] > this.lowerFontSizeLimit && cardNumber > 1) {
          this[currentFontSizeProperty] = this[currentFontSizeProperty] - 1
          await this.$nextTick()
          currentHeight = this.$refs[ref].scrollHeight
          cardNumber = currentHeight / 496
        }

        this.loading = false
      }
    },
    toggleExpand () {
      this.expanded = !this.expanded

      if (this.expanded) {
        setTimeout(() => {
          this.configureSingleCardSize('traitHeightDeterminer', 'currentTraitFontSize')
          if (this.showWeaponTraitsCard) {
            this.configureSingleCardSize('weaponTraitHeightDeterminer', 'currentWeaponTraitFontSize')
          }

          if (this.showEquipmentCard) {
            this.configureSingleCardSize('equipmentHeightDeterminer', 'currentEquipmentFontSize')
          }

          if (this.determinedSizingAtLeastOnce === false) {
            this.determinedSizingAtLeastOnce = true
          }
        }, 100)
      }
    }
  }
}
</script>

<style>
.character {
  @apply flex flex-row w-full items-start justify-start flex-wrap;

  &__expander {
    @apply w-full overflow-y-hidden h-0 flex flex-row items-start justify-start flex-wrap;

    &--expanded {
      @apply overflow-y-visible h-auto py-6;
    }
  }

  &__options {
    @apply flex flex-col flex-wrap w-full h-full p-1;

    span {
      @apply w-1/3;
    }
  }

  &__card {
    @apply relative mb-6 ml-6 overflow-y-hidden;

    width: 693px;
    height: 496px;
    background-size: 693px 496px;

    &__version {
      @apply absolute text-yellow-400 left-3 text-sm;
      top: 100px;
      width: 75px;

      &--local {
        @apply text-black;
      }
    }

    &__container {
      width: 693px;
      @apply ml-6;

      .character__card {
        @apply ml-0;
      }
    }

    &__stats {
      @apply flex flex-col absolute right-1;
      top: 85px;
      height: 230px;
      width: 330px;

      &__damage {
        @apply flex flex-row items-center justify-center self-end mb-3;
        width: 300px;

        &__pod {
          @apply flex flex-col relative items-center justify-center;
          width: 125px;
          height: 125px;

          &__image {
            @apply absolute w-full h-auto left-0;
            top: 10px;
          }

          &:first-child {
            margin-right: 40px;
          }

          h3 {
            @apply text-7xl text-black leading-none self-center relative;
            z-index: 2;
            height: 60px;
          }

          h4 {
            @apply uppercase inline-block leading-none text-black bg-yellow-400 w-full transform -rotate-90 absolute text-center;
            font-size: 1.5rem;
            transform-origin: 0 0;
            top: 110px;
            left: 88px;
            height: 22px;
            width: 90px;
            z-index: 2;
          }

          &--dark {
            .character__card__stats__damage__pod__image {
              top: 2px;
              left: -7px;
            }

            h3 {
              @apply text-yellow-400;
              margin-left: -20px;
            }

            h4 {
              @apply text-yellow-400 bg-black;
            }
          }
        }
      }

      &__row {
        @apply flex flex-row items-center justify-between mb-3 self-end mx-auto;

        &--1 {
          width: 270px;
        }

        &--2 {
          width: 270px;
        }

        &__pod {
          @apply text-black flex flex-row relative items-center justify-start flex-shrink-0 flex-grow-0;
          width: 100px;

          img {
            @apply block flex-shrink-0 flex-grow-0 absolute left-0 top-1/2;
            width: 112px;
            height: auto;
            z-index: 1;
            transform: translateY(-50%);
          }

          span {
            @apply ml-16 text-5xl text-black relative z-5;
          }
        }
      }
    }

    &__bottom__banner {
      @apply flex flex-col absolute w-full bottom-0 bg-yellow-400 flex-wrap pt-1 px-1 overflow-x-auto;
      height: 75px;

      &__tag {
        @apply block text-base leading-none text-black w-full;
        max-width: 25%;
        margin-bottom: 1px;

        img {
          @apply w-auto inline;

          height: 10px;
        }
      }
    }

    &__middle__banner {
      @apply flex flex-col absolute w-full left-0 z-5;
      bottom: 74px;

      &__row {
        @apply flex flex-row px-3 items-center justify-between;
        background-color: rgba(0, 0, 0, 0.7);
        height: 32px;
        margin-bottom: 0.1rem;

        &__tag {
          @apply text-yellow-400 flex-shrink-0 flex-grow-0 h-auto leading-none;
          font-size: 1.15rem;
        }

        &__title {
          @apply text-ellipsis whitespace-nowrap block overflow-hidden;
          max-width: 128px;
         width:20%;
        }

        &__damage {
          width: 15%;
          @apply inline-flex items-center justify-start;

          img {
            @apply inline;
            height: 30px;
            width: 20px;
            object-fit: cover;

            &:not(:last-child) {
              margin-right: 3px;
            }
          }
        }

        &__ammo {
          width: 5%;
          @apply inline-flex items-center justify-start ml-1;

          img {
            @apply inline w-auto;
            height: 30px;
            width: 20px;
            object-fit: cover;
          }
        }

        &__rof {
          width: 5%;
          @apply inline-flex items-center justify-start;

          img {
            @apply inline w-auto;
            height: 30px;
            width: 20px;
            object-fit: cover;
          }
        }

        &__traits {
          width: 55%;
          @apply text-right;
          line-height: 0.8;
        }
      }
    }

    &__banner {
      @apply flex flex-row absolute w-full top-0;
      height: 75px;

      &__name {
        @apply w-1/2 p-3;

        h4 {
          @apply text-2xl leading-none mb-2;
        }

        h5 {
          @apply text-lg leading-none;
        }
      }

      &__pod {
        width: 12.5%;
        @apply p-2 flex flex-row items-start relative;

        &__images {
          @apply flex flex-row flex-wrap w-full items-end flex-grow flex-shrink-0;
          margin-left: 15px;

          img {

            @apply mb-1;
            width: 28px;
            height: 28px;
            object-fit: contain;

            &.character__card__banner__pod__image--dark {
              @apply bg-black rounded bg-contain;
              margin-right: 5px;
            }

            &.character__card__banner__pod__image {
              @apply rounded bg-contain;
              margin-right: 5px;
            }
          }

          .img {
            @apply mb-1 bg-center bg-no-repeat;
            width: 28px;
            height: 28px;
            background-size: 40px;

            &.character__card__banner__pod__image--dark {
              @apply bg-black rounded bg-contain;
              margin-right: 5px;
            }

            &.character__card__banner__pod__image {
              @apply rounded bg-contain;
              margin-right: 5px;
            }
          }
        }

        &--col {
          @apply flex-col;
        }

        &--center {
          @apply items-center;
        }

        &:not(:last-child) {
          @apply border-r border-yellow-400;
        }

        &__title {
          @apply transform -rotate-90 uppercase inline-block text-base text-right leading-none absolute h-full;
          width: 70px;
          top: 0.5rem;
          left: 0.5rem;
        }

        &__text {
          @apply text-2xl leading-none;

          &:not(:last-child) {
            @apply mb-1;
          }
        }
      }
    }

    &__row {
      @apply font-serif px-1 leading-none;
      padding-bottom: 0.2rem;

      span, strong {
        @apply leading-none;
      }

      &--added {}

      &:first-child {
        @apply mt-1;
      }

      img {
        vertical-align: middle;
        width: 13px;
        height: 13px;
        object-fit: contain;
        @apply inline;
      }
    }
  }
}

.notification-row {
  max-width: 40%;
}
</style>

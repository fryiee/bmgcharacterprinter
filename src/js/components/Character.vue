<template>
  <div class="character">
    <div class="flex flex-col character__card__container">
      <a href="#" @click.prevent="$emit('click', character)" class="character__card" :style="backgroundStyle">
        <div class="character__card__banner">
          <div class="character__card__banner__name">
            <h4>{{character.alias}}</h4>
            <h5>{{character.name}} / {{character.bases_size}}</h5>
          </div>
          <div class="character__card__banner__pod">
            <small class="character__card__banner__pod__title">Rank</small>
            <div class="character__card__banner__pod__images">
              <img v-for="rank in characterRanks" :key="rank.id" :alt="rank.icon" :src="'/dist/img/icons/' + rank.icon + '.png'"/>
            </div>
          </div>
          <div class="character__card__banner__pod">
            <small class="character__card__banner__pod__title">Aff</small>
            <div class="character__card__banner__pod__images">
              <img v-if="affiliation.is_team === false" v-for="affiliation in characterAffiliations" :key="affiliation.id" :alt="affiliation.name" :src="affiliation.icon"/>
            </div>
          </div>
          <div class="character__card__banner__pod">
            <small class="character__card__banner__pod__title">Riv</small>
            <div class="character__card__banner__pod__images">
              <img v-for="affiliation in characterRivals" :key="affiliation.id" :alt="affiliation.name" :src="affiliation.icon"/>
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
              <h3>{{character.willpower}}</h3>
              <h4>Willpower</h4>
            </div>

            <div class="character__card__stats__damage__pod character__card__stats__damage__pod--dark">
              <h3>{{character.endurance}}</h3>
              <h4>Endurance</h4>
            </div>
          </div>

          <div class="character__card__stats__row character__card__stats__row--1">
            <div class="character__card__stats__row__pod">
              <img src="/dist/img/icons/SPECIAL_ICON.png" alt="special icon"/>
              <span>{{character.attack}}</span>
            </div>
            <div class="character__card__stats__row__pod">
              <img src="/dist/img/icons/SPECIAL_ICON.png" alt="special icon"/>
              <span>{{character.defense}}</span>
            </div>
          </div>
          <div class="character__card__stats__row character__card__stats__row--2">
            <div class="character__card__stats__row__pod">
              <img src="/dist/img/icons/SPECIAL_ICON.png" alt="special icon"/>
              <span>{{character.strength}}+</span>
            </div>
            <div class="character__card__stats__row__pod">
              <img src="/dist/img/icons/SPECIAL_ICON.png" alt="special icon"/>
              <span>{{character.movement}}</span>
            </div>
            <div class="character__card__stats__row__pod">
              <img src="/dist/img/icons/SPECIAL_ICON.png" alt="special icon"/>
              <span>{{character.special}}</span>
            </div>
          </div>
        </div>

        <div class="character__card__middle__banner">
          <div v-for="weapon in characterWeaponsWithTraitNames" :key="weapon.id" class="character__card__middle__banner__row">
            <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__title">{{weapon.name}}</span>
            <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__damage">
              <template v-if="weapon.damage">
              <img v-for="(damage, index) in weaponDamage(weapon)" :key="index" :alt="damage.icon" :src="'/dist/img/icons/' + damage.icon + '.png'"/>
              </template>
              <template v-else>-</template>
            </span>
            <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__rof">
              <template v-if="weapon.rate_of_fire">
                {{weapon.rate_of_fire}}&nbsp;<img src="/dist/img/icons/SPECIAL_ICON.png" alt="ROF icon"/>
              </template>
              <template v-else>-</template>
            </span>
            <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__ammo">
              <template v-if="weapon.ammunition">
                {{weapon.ammunition}}&nbsp;<img src="/dist/img/icons/SPECIAL_ICON.png" alt="Ammo icon"/>
              </template>
              <template v-else>-</template>
            </span>
            <span class="character__card__middle__banner__row__tag character__card__middle__banner__row__traits">{{weapon.trait_names.join(' / ')}}</span>
          </div>
        </div>

        <div class="character__card__bottom__banner">
          <span class="character__card__bottom__banner__tag" v-html="renderIcons(trait.name)" v-for="trait in characterTraits"></span>
        </div>
      </a>
    </div>
    <a href="#" @click.prevent="$emit('click', character)" class="character__card bg-white border border-black">
      <p :class="'character__card__row'+(characterTraits.length <= 5 ? ' character__card__row--large' : '')" :key="trait.id" v-for="trait in characterTraits">
        <strong v-html="renderIcons(trait.name)"></strong>:&nbsp;<span v-html="renderIcons(trait.description)"></span>
      </p>
    </a>
    <a href="#" @click.prevent="$emit('click', character)" class="character__card bg-white border border-black">
      <p class="character__card__row character__card__row--large" :key="trait.id" v-for="trait in characterWeaponTraits">
        <strong v-html="renderIcons(trait.name)"></strong>:&nbsp;<span v-html="renderIcons(trait.description)"></span>
      </p>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Character',
  props: ['character', 'affiliations', 'traits', 'equipment', 'upgrades', 'weapons'],
  data() {
    return {
      icons: [
          'SPECIAL_ICON',
          'RANK_HENCHMAN_ICON',
          'RANK_SIDEKICK_ICON',
          'RANK_LEADER_ICON',
          'RANK_FREE_AGENT_ICON',
          'STUN_ICON',
          'BLOOD_ICON'
      ],
      ranks: [
        {
          id: 1,
          icon: 'RANK_LEADER_ICON'
        },
        {
          id: 2,
          icon: 'RANK_SIDEKICK_ICON'
        },
        {
          id: 3,
          icon: 'RANK_FREE_AGENT_ICON'
        },
        {
          id: 4,
          icon: 'RANK_HENCHMAN_ICON'
        }
      ],
      damage: [
        {
          id: 1,
          icon: 'BLOOD_ICON'
        },
        {
          id: 2,
          icon: 'STUN_ICON'
        }
      ]
    }
  },
  computed: {
    backgroundStyle() {
      return 'background-image:url("' + this.character.background + '");'
    },
    characterAffiliations() {
      if (!this.character.affiliations || this.character.affiliations.length === 0) {
        return []
      } else {
        const affiliations = []

        this.character.affiliations.forEach((affiliation) => {
          for (let i = 0; i < this.affiliations.length; i++) {
            let existingAffiliation = this.affiliations[i]

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
            let existingAffiliation = this.affiliations[i]

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
        const traits = []

        this.character.traits.forEach((trait) => {
          for (let i = 0; i < this.traits.length; i++) {
            let existingTrait = this.traits[i]

            if (existingTrait.id === trait.trait_id) {
              traits.push(existingTrait)
            }
          }
        })

        return traits.sort((trait1, trait2) => {
          return trait1.name.localeCompare(trait2.name)
        })
      }
    },
    characterEquipment() {
      if (!this.character.equipment || this.character.equipment.length === 0) {
        return []
      } else {
        const equipment = []

        this.character.equipment.forEach((equipmentObject) => {
          for (let i = 0; i < this.equipment.length; i++) {
            let existingEquipment = this.equipment[i]

            if (existingEquipment.id === equipmentObject.equipment_id) {
              equipment.push(existingEquipment)
            }
          }
        })

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
            let existingUpgrade = this.upgrades[i]

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
            let existingWeapon = this.weapons[i]

            if (existingWeapon.id === weapon_id) {
              weapons.push(existingWeapon)
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
        for (let i = 0; i < characterWeapons.length; i++) {
          const traits = []
          const characterWeapon = characterWeapons[i]

          characterWeapon.traits.forEach((trait) => {
            for (let i = 0; i < this.traits.length; i++) {
              let existingTrait = this.traits[i]

              if (existingTrait.id === trait.trait_id && (traits.findIndex(traitObject => traitObject.id === trait.trait_id) === -1)) {
                traits.push(existingTrait)
              }
            }
          })

          characterWeapons[i].trait_names = traits.sort((trait1, trait2) => {
            return trait1.name.localeCompare(trait2.name)
          }).map((trait) => {
            return trait.name
          })
        }

        return characterWeapons
      }
    },
    characterWeaponTraits () {
      if (!this.characterWeapons || this.characterWeapons.length === 0) {
        return []
      } else {
        const traits = []

        this.characterWeapons.forEach((characterWeapon) => {
          characterWeapon.traits.forEach((trait) => {
            for (let i = 0; i < this.traits.length; i++) {
              let existingTrait = this.traits[i]

              if (existingTrait.id === trait.trait_id && (traits.findIndex(traitObject => traitObject.id === trait.trait_id) === -1)) {
                traits.push(existingTrait)
              }
            }
          })
        })

        return traits.sort((trait1, trait2) => {
          return trait1.name.localeCompare(trait2.name)
        })
      }
    }
  },
  methods: {
    renderIcons (text) {
      this.icons.forEach((icon) => {
        if (text.includes('{' + icon + '}')) {
          text = text.replaceAll('{' + icon + '}', '<img src="/dist/img/icons/' + icon + '.png" alt="' + icon + ' icon"/>')
        }
      })

      return text
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
    }
  },
  mounted() {
    console.log(this.character)
  }
}
</script>

<style>
.character {
  @apply flex flex-row w-full items-start justify-start flex-wrap;

  &__card {
    @apply relative mb-6 ml-6;

    width: 693px;
    height: 496px;

    &__container {
      width: 693px;
      @apply ml-6;

      .character__card {
        @apply ml-0;
      }
    }

    &__stats {
      @apply flex flex-col absolute right-3;
      top: 85px;
      height: 230px;
      width: 330px;

      &__damage {
        @apply flex flex-row items-center justify-center self-end mb-6;
        width: 300px;
        margin-top: 20px;

        &__pod {
          @apply flex flex-col relative;

          &:first-child {
            margin-right: 110px;
          }

          h3 {
            @apply text-7xl text-black bg-yellow-300 leading-none self-center;
            height: 60px;
          }

          h4 {
            @apply uppercase inline-block text-xl leading-none text-black bg-yellow-300 w-full transform -rotate-90 absolute text-center;
            transform-origin: 0 0;
            top: 68px;
            left: calc(100% + 2px);
            height: 18px;
            width: 75px;
          }

          &--dark {

            h3 {
              @apply text-yellow-300 bg-black;
            }

            h4 {
              @apply text-yellow-400 bg-black;
            }
          }
        }
      }

      &__row {
        @apply flex flex-row items-center justify-between mb-6 self-end mx-auto;

        &--1 {
          width: 200px;
        }

        &--2 {
          width: 300px;
        }

        &__pod {
          @apply text-black bg-yellow-300 flex flex-row relative items-center justify-start flex-shrink-0 flex-grow-0;
          width: 90px;

          img {
            @apply block flex-shrink-0 flex-grow-0 w-12 absolute left-0;
            top: -5px;
            filter: invert(100%);
            height: 50px;
            object-fit: contain;
          }

          span {
            @apply ml-14 text-4xl text-black;
          }
        }
      }
    }

    &__bottom__banner {
      @apply flex flex-col absolute w-full bottom-0 bg-yellow-300 flex-wrap p-1 overflow-x-auto;
      height: 75px;

      &__tag {
        @apply block text-base leading-none text-black w-full;
        max-width: 25%;
        margin-bottom: 1px;

        img {
          @apply w-auto inline;
          filter: invert(100%);
          height: 10px;
        }
      }
    }

    &__middle__banner {
      @apply flex flex-col absolute w-full left-0;
      bottom: 74px;

      &__row {
        @apply flex flex-row mb-1 px-3 items-start justify-between;
        background-color: rgba(0, 0, 0, 0.7);
        height: 30px;

        &__tag {
          @apply text-lg text-yellow-300 flex-shrink-0 flex-grow-0 h-full;
        }

        &__title {
          @apply text-ellipsis whitespace-nowrap block overflow-hidden;
          max-width: 120px;
         width:20%;
        }

        &__damage {
          width: 15%;
          @apply inline-flex items-center justify-start;

          img {
            @apply inline;
            height: 20px;
            width: 20px;
            object-fit: contain;
            filter: brightness(0) saturate(100%) invert(85%) sepia(27%) saturate(1037%) hue-rotate(353deg) brightness(104%) contrast(98%);

            &:not(:last-child) {
              margin-right: 3px;
            }
          }
        }

        &__ammo {
          width: 5%;
          @apply inline-flex items-center justify-start;

          img {
            @apply inline w-auto ml-1;
            height: 20px;
            width: 20px;
            object-fit: contain;
            filter: brightness(0) saturate(100%) invert(85%) sepia(27%) saturate(1037%) hue-rotate(353deg) brightness(104%) contrast(98%);
          }
        }

        &__rof {
          width: 5%;
          @apply inline-flex items-center justify-start;

          img {
            @apply inline w-auto;
            height: 20px;
            width: 20px;
            object-fit: contain;
            filter: brightness(0) saturate(100%) invert(85%) sepia(27%) saturate(1037%) hue-rotate(353deg) brightness(104%) contrast(98%);
          }
        }

        &__traits {
          width: 55%;
          @apply text-right;
        }
      }
    }

    &__banner {
      @apply flex flex-row absolute w-full top-0;
      height: 75px;

      &__name {
        @apply w-1/2 p-3;

        h4 {
          @apply text-3xl leading-none mb-2;
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
            filter: invert(100%);
            @apply h-auto mb-1 w-1/2;
          }
        }

        &--col {
          @apply flex-col;
        }

        &--center {
          @apply items-center;
        }

        &:not(:last-child) {
          @apply border-r border-yellow-300;
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
      @apply font-serif px-1 mb-1 leading-none;

      strong, span {
        @apply text-xs;
      }

      &--large {
        strong, span {
          @apply text-base;
        }
      }

      &:first-child {
        @apply mt-1;
      }

      img {
        filter: invert(100%);
        width: 20px;
        height: 12px;
        object-fit: contain;
        @apply h-auto inline;
      }
    }
  }
}

@screen print {
  .character {
  }
}
</style>

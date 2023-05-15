<template>
  <div class="character">
    <a href="#" @click.prevent="$emit('click', character)" class="character__card" :style="backgroundStyle">
      <div class="character__card__banner">
        <div class="character__card__banner__name">
          <h4>{{character.alias}}</h4>
          <h5>{{character.name}} / {{character.bases_size}}</h5>
        </div>
        <div class="character__card__banner__pod">
          <small class="character__card__banner__pod__title">Rank</small>
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
        <div class="character__card__banner__pod character__card__banner__pod--col">
          <span class="character__card__banner__pod__text">{{character.reputation}} rep</span>
          <span class="character__card__banner__pod__text">{{character.funding}} $</span>
        </div>
      </div>
    </a>
    <a href="#" @click.prevent="$emit('click', character)" class="character__card bg-white border border-black">
      <p class="character__card__row" :key="trait.id" v-for="trait in characterTraits">
        <strong v-html="renderIcons(trait.name)"></strong>:&nbsp;<span v-html="renderIcons(trait.description)"></span>
      </p>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Character',
  props: ['character', 'affiliations', 'traits'],
  data() {
    return {
      icons: [
          'SPECIAL_ICON',
          'RANK_HENCHMAN_ICON',
          'RANK_LEADER_ICON',
          'RANK_FREE_AGENT_ICON'
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
              console.log(existingAffiliation)
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
              console.log(existingAffiliation)
              affiliations.push(existingAffiliation)
            }
          }
        })

        return affiliations
      }
    },
    characterTraits() {
      console.log(this.character.traits)
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

        return traits
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
    }
  },
  mounted() {
    console.log(this.character)
  }
}
</script>

<style>
.character {
  @apply flex flex-row w-full items-center justify-center;
  height: 496px;

  &__card {
    @apply relative;

    width: 693px;
    height: 496px;

    &:last-child {
      @apply ml-6;
    }

    &__banner {
      @apply flex flex-row absolute w-full;
      top: 0;
      height: 75px;

      &__name {
        @apply w-1/2 p-3;

        h4 {
          @apply text-3xl;
        }

        h5 {
          @apply text-lg;
        }
      }

      &__pod {
        width: 12.5%;
        @apply p-3 flex flex-row items-start;

        &__images {
          @apply flex flex-col w-full items-end;

          img {
            filter: invert(100%);
            width: 35px;
            @apply h-auto;
          }
        }

        &--col {
          @apply flex-col;
        }

        &:not(:last-child) {
          @apply border-r border-yellow-300;
        }

        &__title {
          @apply transform -rotate-90 uppercase inline-block text-base text-right;
        }

        &__text {
          @apply text-2xl;
        }
      }
    }

    &__row {
      @apply font-serif text-xs p-1;

      img {
        filter: invert(100%);
        width: 20px;
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

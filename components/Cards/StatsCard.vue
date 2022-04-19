<template>
  <card
    class="card-stats card-stats-height"
    :show-footer-line="true"
  >
    <div class="card-container">
      <div class="stats-card">
        <p
          class="card-category card-category-stats"
        >
          {{ subTitle }}
        </p>
        <h3
          class="card-title card-title-stats"
        >
          {{ title }}
        </h3>
      </div>
      <div class="icons-cont">
        <img
          :src="`/img/icons/user${img}.svg`"
          alt=""
        >
      </div>
    </div>
  </card>
</template>
<script>
import Card from './Card.vue';

export default {
  name: 'StatsCard',
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    icon: String,
    title: String,
    subTitle: String,
    img: String,
  },
};
</script>
<style>
  .card-container {
    display: flex;
    justify-content: space-between;
  }
  .icons-cont {
    background-color: #32354F;
    margin: -15px -15px -15px 5px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    width: 100px;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
.card-stats-height {
  min-height: 102px !important;
}
.stats-card {
  width: 60%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.card-category-stats {
  min-height: 40px;
  margin-bottom: 0 !important;
}
.card-title-stats {
  margin-bottom: 0 !important;
}
  @media (max-width: 1350px) {
    .icons-cont {
      display: none;
    }
    .stats-card {
      width: 100%;
    }
  }
</style>

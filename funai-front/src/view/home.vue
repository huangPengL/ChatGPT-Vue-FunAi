<template>
  <div class="home">
    <el-container style="height:100%">
      <el-aside class="el_aside" width="55px" id="navElem" v-if="$route.name && !['UserLogin','HomePage','UserReset','UserRegister','/'].includes($route.name)">
        <Nav></Nav>
      </el-aside>
      <el-main style="height: 100%;">
        <Header v-if="$route.name && !['UserLogin','HomePage','UserReset','UserRegister','/'].includes($route.name)" style="width:100%"></Header>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import Header from "../components/Header.vue";
export default {
  name: "App",
  components: {
    Nav,Header
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-color: rgb(35, 39, 54);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .el_aside{
    overflow: inherit;
  }
}
</style>
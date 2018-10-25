<template>
  <div
    id="app">
    <panel-container
      direction="horizontal">
      <panel
        :defaultLength="300">
      </panel>
      <panel
        :defaultLength="200">
      </panel>
      <panel>
        <panel-container
          direction="vertical">
          <panel>
          </panel>
          <panel>
            <panel-container
              direction="horizontal">
              <panel>
              </panel>
              <panel
                :minLength="300">
                <panel-container
                  direction="vertical">
                  <panel
                    :minLength="200">
                  </panel>
                  <panel>
                  </panel>
                  <panel
                    :minLength="200">
                  </panel>
                </panel-container>
              </panel>
            </panel-container>
          </panel>
        </panel-container>
      </panel>
    </panel-container>
  </div>
</template>

<script>
import PanelContainer from '@/components/PanelContainer';
import Panel from '@/components/Panel';

export default {
  name: 'app',
  components: {
    PanelContainer,
    Panel
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>

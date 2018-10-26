<template>
  <div
    id="app">
    <pane-container
      direction="horizontal">
      <pane
        :defaultLength="300">
      </pane>
      <pane
        :defaultLength="200">
      </pane>
      <pane>
        <pane-container
          direction="vertical">
          <pane>
          </pane>
          <pane>
            <pane-container
              direction="horizontal">
              <pane>
              </pane>
              <pane
                :minLength="300">
                <pane-container
                  direction="vertical">
                  <pane
                    :minLength="200">
                  </pane>
                  <pane>
                  </pane>
                  <pane
                    :minLength="200">
                  </pane>
                </pane-container>
              </pane>
            </pane-container>
          </pane>
        </pane-container>
      </pane>
    </pane-container>
  </div>
</template>

<script>
import PaneContainer from '@/components/PaneContainer';
import Pane from '@/components/Pane';

export default {
  name: 'app',
  components: {
    PaneContainer,
    Pane
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

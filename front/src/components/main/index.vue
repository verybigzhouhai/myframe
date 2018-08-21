<template>
    <div id="main">
        <h1>HelloWorld！</h1>
    </div>
</template>

<script>
    import store from "@/store";
    export default {
        name: "HelloWorld",
        data() {
            return {
            }
        },
        computed:{
          
        },
        store,
        methods: {
            
        },
        created: function() {
            var that = this;
            // 初始化显示视图
            this.$nextTick(function() {
                
            })
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
   
</style>




// WEBPACK FOOTER //
// src/components/main/data.vue
<template>
  <h1 class="red">{{greeting}} World</h1>
</template>

<script>
export default {
    data:function(){
        return {
            greeting:"Hi there"
        }
    }
}
</script>

<style>
.red {
	color: #f00;
}
</style>

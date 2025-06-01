<template>
<header>
  <nav>
    <u>
      <li>

        <NuxtLink to="/blog">Blog</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/posts/1">Post 1</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/posts/2">Post 2</NuxtLink>
      </li>
    </u>
  </nav>
</header>
</template>


<style scoped>
li{
  list-style: none;
}
li a {
  color: #ff0000;
  text-decoration: none;
  padding: 0.5rem 1rem;
}
</style>

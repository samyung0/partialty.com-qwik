<script>
  let data;
  const submit = (e) => {
    data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log(data);
  }
</script>

<form on:submit|preventDefault={submit}>
  <input type="text" name="name" />
  <input type="text" name="job" />
  <button>Submit</button>
  {#if data}
    <p>Data received: {JSON.stringify(data, null, 2)}</p>
  {/if}
</form>



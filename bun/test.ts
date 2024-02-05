// import Elysia from "elysia";
let c = 0;
for(let i=0;i<200;i++){
  try{
  const a = new WebSocket("wss://api.partialty.com/content/ws");

  a.addEventListener('open', () => {
    c++;
    a.send(JSON.stringify({
      type: "init",
      userId: i,
      accessible_courses: ["*"]
    }))
    if(c === 50){
      a.send(JSON.stringify({
        type: "terminate",
        userId: i
      }))
      a.close();
    }
    setTimeout(() => {
      a.send(JSON.stringify({
        type: "terminate",
        userId: i
      }))
      a.close();
    }, 5000);
  })
}catch(e){
  console.error(e);
}
}

// const app = new Elysia().get("/", () => {})
// export default app;
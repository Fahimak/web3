export async function createNft(nftDetails) {
  // try {
  //   console.log(nftDetails);
  //   const response = await fetch("/api/createNft", {
  //     // We convert the React state to JSON and send it as the POST body
  //     body: nftDetails,
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.log(error);
  // }
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nftDetails),
  };
  fetch("http://localhost:3080/api/createNft", requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
}

// export async function createUser(data) {
//   const response = await fetch(`/api/user`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user: data }),
//   });
//   return await response.json();
// }

// export async function createNft() {
//   const response = await fetch();
// }

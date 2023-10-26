import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { DisplayBoard } from "./components/DisplayBoard";
import { createNft } from "./services/UserService";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

var jsonIpfs = "";

function App() {
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(-1);

  let ipfsTypes;
  try {
    ipfsTypes = create({
      url: "https://ipfs.infura.io:5001/api/v0",
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfsTypes = undefined;
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formTypes = event.target;
    const filesTypes = formTypes[0].files;

    if (!filesTypes || filesTypes.length === 0) {
      return alert("No files selected");
    }

    const fileTypes = filesTypes[0];
    // upload files
    const result = await ipfsTypes.add(fileTypes);

    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    setCount((prevCount) => prevCount + 1);

    const jsonFile = {
      name: "VEENFT",
      creator: "AK",
      description: "IPFS NFT",
      image: `https://ipfs.infura.io/ipfs/${images[count].path}`,
      type: "image/png",
      format: "none",
      properties: {
        license: "MIT-0",
        collection: "Veehive Collection",
        website: "https://veehive.ai/",
      },
      attributes: [
        {
          trait_type: "coolness",
          value: "50",
          "max-value": "100",
        },
        {
          trait_type: "colour",
          value: "gradient",
        },
      ],
    };

    const encodedJsonObject = Buffer.from(JSON.stringify(jsonFile)).toString(
      "base64"
    );

    const decodedJsonObject = Buffer.from(encodedJsonObject, "base64").toString(
      "ascii"
    );
    // console.log(decodedJsonObject);

    const jsonUpload = await ipfsTypes.add(decodedJsonObject);

    jsonIpfs = `https://ipfs.infura.io/ipfs/${jsonUpload.path}`;
    formTypes.reset();
    console.log(`This is IPFS: ${jsonIpfs}`);
  };

  const fetchNft = () => {
    createNft(nftDetails).then((users) => {
      console.log(users);
    });
    // console.log(jsonIpfs);
  };
  // const fetchNft = (jsonIpfs) => {
  //   createNft(jsonIpfs).then((users) => {
  //     console.log(users);
  //   });
  //   // console.log(jsonIpfs);
  // };

  const [nftDetails, setNftDetails] = useState({ name: "", symbol: "" });

  const handleChange = (e) => {
    setNftDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="App">
      <Header></Header>
      <div className="main-body">
        <input
          onChange={handleChange}
          placeholder="Name"
          name="name"
          value={nftDetails.name}
        />
        <input
          onChange={handleChange}
          placeholder="Symbol"
          name="symbol"
          value={nftDetails.symbol}
        />
      </div>
      <div className="display-board">
        <DisplayBoard createNft={() => fetchNft(nftDetails)}></DisplayBoard>
      </div>
      {/* <div>
        <header className="">
          {!ipfsTypes && (
            <p>
              Oh oh, Not connected to IPFS. Checkout out the logs for errors
            </p>
          )}
        </header>

        {ipfsTypes && (
          <>
            <p>Upload File using IPFS</p>

            <form onSubmit={onSubmitHandler}>
              <input name="file" type="file" />

              <button type="submit">Upload File</button>
            </form>

            <div>
              {images.map((image, index) => (
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://ipfs.infura.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                  key={image.cid.toString() + index}
                />
              ))}
            </div>
          </>
        )}
      </div> */}
    </div>
  );
}

export default App;

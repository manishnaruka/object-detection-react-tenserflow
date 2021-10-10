import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [model, setModel] = useState();
  const [imgsrc, setImgSrc] = useState("");
  const [predictions, setPredictions] = useState([]);
  async function loadModel() {
    try {
      const model = await cocoSsd.load();
      setModel(model);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  const handleFileChange = async (event) => {
    let imageObj = await URL.createObjectURL(event.target.files[0]);
    await setImgSrc(imageObj);
  };

  const handleDetect = async () => {
    const predictions = await model.detect(document.getElementById("img"));
    console.log(predictions)
    setPredictions(predictions);
  };

  return (
    <div className="container pt-5">
      <div className="row">
        <div className="col-6">
          <input
            className="form-control w-50 float-end"
            type="file"
            id="formFile"
            name="img"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-6">
          <button className="btn btn-success" onClick={handleDetect}>
            Start Detect
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mt-5 text-center">
          {predictions && predictions.length > 0 ? (
            predictions.map((x)=><span className="badge rounded-pill p-2 bg-light text-dark">{x.class}</span>)
          ) : (
            <span class="badge rounded-pill p-2 bg-light text-dark">
              Nothing Found
            </span>
          )}
        </div>
      </div>
      {imgsrc && (
        <div className="row justify-content-center align-items-center">
          <div className="col-4 mt-5">
            <img src={imgsrc} width={300} id="img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

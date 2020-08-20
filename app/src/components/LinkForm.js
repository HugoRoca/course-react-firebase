import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const LinkForm = (props) => {
  const [values, setValues] = useState({ url: "", name: "", description: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateURL(values.url)) {
      toast("Invalid URL", { type: "warning", autoClose: 2000 });
      return
    }

    props.addOrEditLink(values);
    setValues({ url: "", name: "", description: "" });
  };

  const validateURL = (str) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      str
    );
  };

  const getLinkById = async (id) => {
    const doc = await db.collection("links").doc(id).get();
    setValues({ ...doc.data() });
  };

  useEffect(() => {
    if (props.currentId === "") {
      setValues({ url: "", name: "", description: "" });
    } else {
      getLinkById(props.currentId);
    }
  }, [props.currentId]);

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">insert_link</i>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="https://someurl.com"
          name="url"
          onChange={onChange}
          value={values.url}
        />
      </div>
      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">create</i>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="website name"
          name="name"
          onChange={onChange}
          value={values.name}
        />
      </div>
      <div className="form-group">
        <textarea
          name="description"
          rows="3"
          className="form-control"
          placeholder="Write a description"
          onChange={onChange}
          value={values.description}
        ></textarea>
      </div>
      <button className="btn btn-primary btn-block">
        {props.currentId === "" ? "Save" : "Update"}
      </button>
    </form>
  );
};

export default LinkForm;

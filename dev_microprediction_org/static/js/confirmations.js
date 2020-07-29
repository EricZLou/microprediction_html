const base_url = home_url + "confirms/";

var write_key;
var resp;
var max_visible = 0;

function OnLoadConfirmations() {
  write_key = JSON.parse(localStorage.getItem('microprediction_key_current'))[0];
  var url = base_url+write_key+"/";
  const request = new Request(url, {method: 'GET'});

  fetch(request)
  .then(response => {
    if (response.status !== 200) {
      throw "Response status is not 200: " + response.status;
    } else {
      return response.json();
    }
  })
  .then(json => {
    resp = json;
    LoadConfirmations();
    let name = "confirms/" + write_key + "/";
    document.getElementById("box-href").href = name;
    document.getElementById("box-info-loaded-from").style.display = "inline-block";
  })
  .catch(error => {
    console.log("Error Caught");
    console.log(error);
  })
}

function LoadConfirmations() {
  confirmations_div = document.getElementById("confirmations");
  for (var idx in resp) {
    if (Number(idx) === resp.length - 1) {
      document.getElementById("see-more-button").style.display = "none";
      document.getElementById("see-more-text").style.display = "inline";
    }
    if (idx >= max_visible) {
      if (idx >= max_visible + 50) {
        break;
      }
      confirm_div = CreateConfirmDiv(JSON.parse(resp[idx]));
      confirmations_div.appendChild(confirm_div);
    }
  }
  max_visible = max_visible + 50;
}

function CreateConfirmDiv(item) {
  confirm_div = document.createElement("div");
  confirm_div.id = "confirm-transact-card";

  time_div = document.createElement("div");
  time_div.id = "confirm-time";
  time_div.innerText = item["time"].slice(0,-7);
  confirm_div.appendChild(time_div);

  if (!("operation" in item)) {
    if ("type" in item && item["type"] === "cancel") {
      item["operation"] = "cancel";
    }
    else {
      item["operation"] = "unknown";
    }
  }

  if (item["operation"] === "set") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("SET ", pos_neg_color=false, null, exact_color="#706398", bold=true),
        TextDiv(item["examples"][0]["name"].slice(0,-5), null, null, null, bold=true),
        TextDiv(" to "),
        TextDiv(Math.round((Math.pow(10,8) * item["examples"][0]["value"])) / Math.pow(10,8), null, null, null, bold=true)
      ])
    );
    confirm_div.appendChild(TextDiv("Percentiles:"));
    percentile_div = document.createElement("div");
    percentile_div.id = "confirm-values";
    for (key in item["examples"][0]["percentiles"]) {
      percentile_div.appendChild(
        JoinDivs([
          TextDiv(key),
          TextDiv(": "),
          TextDiv(Math.round((Math.pow(10,5) * item["examples"][0]["percentiles"][key])) / Math.pow(10,5))
        ])
      );
    }
    percentile_div.appendChild(TextDiv("."));
    confirm_div.appendChild(percentile_div);

  } else if (item["operation"] === "submit") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("SUBMIT ", pos_neg_color=false, null, exact_color="#00A176", bold=true),
        TextDiv(item["name"].slice(0,-5), null, null, null, bold=true),
        TextDiv(" with "),
        TextDiv(item["delays"], null, null, null, bold=true),
        TextDiv(" delay")
      ])
    );
    confirm_div.appendChild(TextDiv("Sample values:"));
    values_div = document.createElement("div");
    values_div.id = "confirm-values";
    for (value of item["some_values"]) {
      values_div.appendChild(
        TextDiv(Math.round((Math.pow(10,5) * value)) / Math.pow(10,5))
      );
    }
    confirm_div.appendChild(values_div);

  } else if (item["operation"] === "touch") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("TOUCH ", pos_neg_color=false, null, exact_color="#C1573D", bold=true),
        TextDiv(item["name"].slice(0,-5), null, null, null, bold=true)
      ])
    );
    random_div = document.createElement("div");
    random_div.id = "confirm-values";
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    confirm_div.appendChild(random_div);

  } else if (item["operation"] === "cancel") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("CANCEL ", pos_neg_color=false, null, exact_color="#000", bold=true),
        TextDiv(item["name"], null, null, null, bold=true),
        TextDiv(" with "),
        TextDiv(item["delays"], null, null, null, bold=true),
        TextDiv(" delays")
      ])
    );
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("Success: "),
        TextDiv(item["success"], null, null, null, bold=true)
      ])
    );
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("Participant: "),
        TextDiv(item["participant"], null, null, null, bold=true)
      ])
    );
    confirm_div.appendChild(
      TextDiv(item["explanation"])
    );
    random_div = document.createElement("div");
    random_div.id = "confirm-values";
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    confirm_div.appendChild(random_div);

  } else if (item["operation"] === "withdraw") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("WITHDRAW ", pos_neg_color=false, null, exact_color="#000", bold=true),
        TextDiv(item["name"], null, null, null, bold=true),
        TextDiv(" with "),
        TextDiv(item["delays"], null, null, null, bold=true),
        TextDiv(" delays")
      ])
    );
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("Success: "),
        TextDiv(item["success"], null, null, null, bold=true)
      ])
    );
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("Code: "),
        TextDiv(item["code"], null, null, null, bold=true)
      ])
    );
    random_div = document.createElement("div");
    random_div.id = "confirm-values";
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    confirm_div.appendChild(random_div);

  } else if (item["operation"] === "bankruptcy") {
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("BANKRUPT ON ", pos_neg_color=false, null, exact_color="#000", bold=true),
        TextDiv(item["name"], null, null, null, bold=true)
      ])
    );
    confirm_div.appendChild(
      JoinDivs([
        TextDiv("Code: "),
        TextDiv(item["code"], null, null, null, bold=true)
      ])
    );
    random_div = document.createElement("div");
    random_div.id = "confirm-values";
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    random_div.appendChild(TextDiv("."));
    confirm_div.appendChild(random_div);

  } else {
    confirm_div.appendChild(TextDiv("unknown action"));
  }

  return confirm_div;
}
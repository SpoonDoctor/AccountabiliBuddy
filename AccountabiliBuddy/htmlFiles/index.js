/* jshint browser: true */
"use strict";

var contentPanels = document.getElementsByClassName("panelContent");
var navigationTabs = document.getElementsByClassName("tab");
var currentTabClass;
var unitDropdown = document.getElementById("goalTypeDropdown");
var unitLabels = document.getElementsByClassName("goalUnitLabel");
var progressEntries = document.getElementsByClassName("entryValue");
var goalEntry = document.getElementById("goalValue");
var succThreshold = document.getElementById("successValue");
var progressSave = document.getElementById("progressSave");
var goalsSave = document.getElementById("goalsSave");
var buddyBox = document.getElementById("buddyBox");

window.onload = function()
{

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function()
  {
    if (xmlHttp.readyState === 4 && xmlHttp.status !== 500)
    {
      var responseJson = JSON.parse(xmlHttp.response);
      console.log(responseJson);
      progressEntries[0].value = responseJson.sunday;
      progressEntries[1].value = responseJson.monday;
      progressEntries[2].value = responseJson.tuesday;
      progressEntries[3].value = responseJson.wednesday;
      progressEntries[4].value = responseJson.thursday;
      progressEntries[5].value = responseJson.friday;
      progressEntries[6].value = responseJson.saturday;

    }

    if (xmlHttp.readyState === 4)
    {
      var xmlHttp2 = new XMLHttpRequest();
      xmlHttp2.onreadystatechange = function()
      {
        if (xmlHttp2.readyState === 4 && xmlHttp2.status !== 500)
        {
          var responseJson2 = JSON.parse(xmlHttp2.response);
          unitDropdown.value = responseJson2.dropdown;
          goalEntry.value = responseJson2.goal;
          succThreshold.value = responseJson2.succThreshold;
          buddyBox.value = responseJson2.abbEmail;

          Array.from(unitLabels).forEach(function(label)
          {
            label.innerHTML = unitDropdown.options[unitDropdown.selectedIndex].value;
            //console.log(unitDropdown.options[unitDropdown.selectedIndex].value);
          });
        }
        else if (xmlHttp2.readyState === 4 && xmlHttp2.status === 500)
        {
          navigationTabs[0].classList.add("deactivated");
          navigationTabs[0].classList.add("inactive");
          navigationTabs[0].classList.remove("active");
          navigationTabs[1].classList.add("active");
          navigationTabs[1].classList.remove("inactive");
          contentPanels[0].classList.add("inactive");
          contentPanels[0].classList.remove("active");
          contentPanels[1].classList.add("active");
          contentPanels[1].classList.remove("inactive");

        }
      };
      xmlHttp2.open("GET", "setValsGoals");
      xmlHttp2.send();
    }
  };
  xmlHttp.open("GET", "/setValsProg");
  xmlHttp.send();
};

Array.from(progressEntries).forEach(function(progressEntry)
{
  progressEntry.addEventListener("keypress", function(event)
  {
    if (event.charCode < 48 || event.charCode > 57)
    {
      event.preventDefault();
      console.log("Input must be a positive integer number");
    }
  });
});

Array.from(navigationTabs).forEach(function(element)
{
  element.addEventListener("mouseover", function()
  {
    if (!element.classList.contains("deactivated"))
    {
      element.classList.add("hover");
    }
  });
  element.addEventListener("mouseout", function()
  {
    element.classList.remove("hover");

  });
  element.addEventListener("click", function()
  {
    Array.from(navigationTabs).forEach(function(elementCompare)
    {
      if (!element.classList.contains("deactivated"))
      {
        if (element !== elementCompare)
        {
          elementCompare.classList.remove("active");
          elementCompare.classList.add("inactive");
        }
        else
        {
          elementCompare.classList.add("active");
          elementCompare.classList.remove("inactive");
          if (elementCompare.classList.contains("tab1"))
          {
            currentTabClass = "tab1";
          }
          else if (elementCompare.classList.contains("tab2"))
          {
            currentTabClass = "tab2";
          }
          // else
          // {
          //   currentTabClass = "tab3";
          // }
        }
      }
    });

    Array.from(contentPanels).forEach(function(panel)
    {
      if (!element.classList.contains("deactivated"))
      {
        if (panel.classList.contains(currentTabClass))
        {
          panel.classList.add("active");
          panel.classList.remove("inactive");
        }
        else
        {
          panel.classList.add("inactive");
          panel.classList.remove("active");
        }
      }
    });
  });
});

goalEntry.addEventListener("keypress", function(event)
{
  if (event.charCode < 48 || event.charCode > 57)
  {
    event.preventDefault();
    console.log("Input must be a positive integer number");
  }
});

succThreshold.addEventListener("keypress", function(event)
{
  if (event.charCode < 48 || event.charCode > 57)
  {
    event.preventDefault();
    console.log("Input must be a positive integer number");
  }
});

succThreshold.addEventListener("blur", function()
{
  if (succThreshold.value > 100)
  {
    succThreshold.value = 100;
  }
});

unitDropdown.addEventListener("change", function()
{
  Array.from(unitLabels).forEach(function(label)
  {
    label.innerHTML = unitDropdown.options[unitDropdown.selectedIndex].value;
    console.log(unitDropdown.options[unitDropdown.selectedIndex].value);
  });
});

progressSave.addEventListener("click", function()
{
  var formData = {
    "sunday": progressEntries[0].value,
    "monday": progressEntries[1].value,
    "tuesday": progressEntries[2].value,
    "wednesday": progressEntries[3].value,
    "thursday": progressEntries[4].value,
    "friday": progressEntries[5].value,
    "saturday": progressEntries[6].value
  };
  console.log(JSON.stringify(formData));
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "/progressSave");
  xmlHttp.send(JSON.stringify(formData));
  // return xmlHttp.responseText;
});
goalsSave.addEventListener("click", function()
{
  if (succThreshold.value > 100)
  {
    succThreshold.value = 100;
  }
  var formData = {
    "dropdown": unitDropdown.options[unitDropdown.selectedIndex].value,
    "goal": goalEntry.value,
    "succThreshold": succThreshold.value,
    "abbEmail": buddyBox.value
  };
  console.log(JSON.stringify(formData));
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "/goalsSave"); // false for synchronous request
  xmlHttp.send(JSON.stringify(formData));
  navigationTabs[0].classList.remove("deactivated");
});
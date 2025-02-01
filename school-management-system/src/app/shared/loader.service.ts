import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  loadingStart(elementId: string, msg: string) {
    if (elementId == null || elementId == undefined) {
      return
    }
    let element = document.getElementById(elementId);
    if (element == null) { return }

    let divNode = document.createElement('div');
    let divNodeChild = document.createElement('div');
    let spinnerNode = document.createElement('div');
    let spanNode = document.createElement('span');
    let textNode = document.createTextNode(msg);
    spanNode.appendChild(textNode)
    divNodeChild.appendChild(spinnerNode)
    divNodeChild.appendChild(spanNode)
    divNode.appendChild(divNodeChild)
    divNode.classList.add("LoaderOverlay")
    divNodeChild.classList.add("LoaderPanel")
    spanNode.classList.add("Loadermsg")
    spinnerNode.classList.add("spinnerBorder","spinnerThemeGreen")

    element.appendChild(divNode)

  }

  loadingStop(elementId:string){
    if (elementId == null || elementId == undefined) {
      return
    }
    let element = document.getElementById(elementId);
    if (element == null) { return }
    let loaderEl = element.lastElementChild ;
    let loaderElementClass = element.lastElementChild ? element.lastElementChild.className : null;
    if( loaderEl && loaderElementClass == "LoaderOverlay"){
      element.removeChild(loaderEl)
    }
  }
}

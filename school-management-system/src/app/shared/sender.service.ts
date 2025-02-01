import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenderService {


  private readonly http: HttpClient = inject(HttpClient);

  makeGetSeverCall(formUrl: string, formData: any) {
    return this.http.get(formUrl, { params: formData })
  }
  makeDeleteSeverCall(formUrl: string, formData: any) {
    return this.http.delete(formUrl, { params: formData })
  }
  makePostSeverCall(formUrl: string, formData: any) {
    return this.http.post(formUrl,formData, {})
  }
  makePostSeverCallWithHeaders(formUrl: string, formData: any,headers:any) {
    return this.http.post(formUrl,formData, headers)
  }
  makePutSeverCall(formUrl: string, formData: any) {
    return this.http.put(formUrl,formData)
  }
  makeGetSeverCallWithHeaders(formUrl: string, formData: any,headers:any) {
    return this.http.post(formUrl,{ params: formData,headers })
  }
}

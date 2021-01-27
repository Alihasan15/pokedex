import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPipe'
})
export class CustomPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value)return;
    let wordChanged=value[0].toUpperCase()+String(value).slice(1);

    return wordChanged;
  }

}

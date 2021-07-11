export class Config
{
  public asRetroarchConfig() : string
  {
    const keys = Object.keys(this);
    let response = '';
    for (const key of keys)
      response += key + ' = "' + (this[key] === null ? 'nul' : this[key]) + '"\n';
    return response;
  }
}
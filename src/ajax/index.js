{
  let _Authorize = function(){
    this.token = '';
    this.isRefresh = false;
    this._resolve = null;
    this._reject = null;
    this.ready = new Promise((resolve, reject)=>{
      this._resolve = resolve;
      this._reject = reject;
    });

    this.getToken = ()=>{
      if(this.isRefresh){
        window.kara.refreshToken({
          success: result=>{
            this.token = `bearer ${result.token}`;
            this._resolve();
          },
          fail: ()=>{
            window.kara.logout();
            this._reject({resultCode: "999993", resultMessage: "刷新Token失败[JSSDK]"});
          }
        });
      }else{
        window.kara.getToken({
          success: result=>{
            this.token = result.token;
            this._resolve();
          },
          fail: ()=>{
            this._reject({resultCode: "999994", resultMessage: "获取Token失败[JSSDK]"});
          }
        });
      }
    }

    this.oauth2 = ()=>{
      if(window.kara){
        this.getToken();
      }else{
        document.addEventListener('JSSDKReady', ()=>{
          this.getToken();
        });
      }
    };

    if(location.hash && location.hash.indexOf("access_token=")!==-1){
      let tokenObj = {};
      location.hash.substring(1).split("&").reduce((t, v)=>{
        let kv = v.split("=");
        t[kv[0]] = decodeURIComponent(kv[1]);
        return t;
      }, tokenObj);
      this.token = tokenObj['token_type'] + " " + tokenObj['access_token'];
      this._resolve();
    }else{
      this.oauth2();
    }

    this.refreshToken = ()=>{
      this.isRefresh = true;
      this._resolve = null;
      this._reject = null;
      this.ready = new Promise((resolve, reject)=>{
        this._resolve = resolve;
        this._reject = reject;
      });
      this.oauth2();
    };
  };

  let _Ajax = function(){
    this.baseURL = process.env.GATEWAY;
    this.fetching = 0;
    this.auth401 = false;

    this._ = (pathURL, {
      params={},
      body={},
      method='GET',
      headers={
        'Content-Type': 'application/json'
      },
      credentials='omit',
      lock=false
    }={})=>{
      if(lock && this.fetching>0) return Promise.reject('locked.');

      this.auth401 = false;

      let options = {method, headers: Object.assign({}, headers), credentials};

      let queryString = '';
      let keys = Object.keys(params);
      if(keys.length>0){
        queryString = pathURL.indexOf("?")!=-1 ? "&" : "?";
        queryString += keys.map(k=>k+'='+encodeURIComponent(params[k])).join('&');
      }

      if(body instanceof FormData){
        delete options.headers['Content-Type']
        options.body = body
      }else{
        let bodyKeys = Object.keys(body);
        if(bodyKeys.length>0){
          options.body = JSON.stringify(body);
        }
      }

      let apiURL = this.baseURL+pathURL+queryString;
      if(/^(http|https)/.test(pathURL)){
        apiURL = pathURL+queryString;
      }

      let _fetch = ()=>{
        this.fetching++;
        options.headers.Authorization = headers.Authorization || $auth.token;
        return fetch(apiURL, options)
        .then((res)=>{
          if(res.ok)  return res.json();
          if(res.status === 500){
            return {resultCode: "999993", resultMessage: "服务器异常[status: 500]"};
          }else if(res.status === 401){
            if(!this.auth401){
              $auth.refreshToken();
            }
            this.auth401 = true;
            return $auth.ready.then(()=>{
              this.fetching--;
              return _fetch();
            }, data=>{return data});
          }else if(res.status === 404){
            return {resultCode: "999995", resultMessage: "资源不存在[status: 404]"};
          }else if(res.status === 405){
            return {resultCode: "999996", resultMessage: "请求方法错误[status: 405]"};
          }else{
            return {resultCode: "999997", resultMessage: `未知错误[status: ${res.status}]`};
          }
        }).catch((e)=>{
          return {resultCode: "999998", resultMessage: "网络异常"};
        }).then((data)=>{
          this.fetching--;
          if(!!data.error){
            return {resultCode: "999999", resultMessage: data.error_description};
          }
          return data;
        });
      };

      return $auth.ready.then(_fetch, data=>{return data});
    };
  };

  window.$auth = new _Authorize();
  window.$$$ = new _Ajax();
  window.$ajax = $$$._;
  window.$ajax.get = $ajax;
  window.$ajax.post = (p, o={})=>{
    o.method = 'POST';
    return $ajax(p, o)
  };
}

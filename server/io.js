// An example svc:
export default function(socket, io) { 
    return Object.freeze({
      /* Just define the methods here */
      someEvent() { 
        return { status: 'ok' }
      },
      async fn2(msg) { 
        const users = await getUsers(msg)
        return users
      },
      fn3(msg) {
        return new Promise((resolve, reject) => {
          someTimeConsumingFunction(msg, (err, progress) => {
            if (err) {
              reject(err)
            } else {
              socket.emit('progress', progress)
              if (progress === 1) {
                resolve(progress)
              }
            }
          })
        })
      }
    })
  }
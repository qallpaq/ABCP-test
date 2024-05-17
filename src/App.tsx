// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useCallback, useState} from 'react';
import {API, LS} from "./utils";
import {useThrottle} from "./hooks";
import {PLACEHOLDER_API_URL} from "./constants";
import {GetUserInfoButton, UserInfo} from "./components";
import {User} from "./types";

const PlaceholderAPI = new API(PLACEHOLDER_API_URL);

function App(): JSX.Element {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const receiveRandomUser = useCallback(async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    const userId = Math.floor(Math.random() * (10 - 1)) + 1;
    const cachedUser = LS.getValue(`${userId}`)

    if (cachedUser) {
      // TODO: set cache work in API ???
      setUserInfo(JSON.parse(cachedUser));
    } else {
      const user = await PlaceholderAPI.getData<User, number>(userId);
      user && LS.setValue<User>(`${userId}`, user)

      setUserInfo(user);
    }
  }, []);

  const receiveRandomUserThrottled = useThrottle({
    callbackFn: receiveRandomUser as <T>(args?: (T | undefined)) => any,
    throttleMs: 1000,
  });

  return (
    <div>
      <header>Get a random user</header>
      <GetUserInfoButton onClick={receiveRandomUserThrottled} />
      {userInfo && <UserInfo user={userInfo} />}
    </div>
  );
}

export default App;

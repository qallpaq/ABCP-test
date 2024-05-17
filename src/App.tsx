// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {
  memo, useCallback, useRef, useState,
} from 'react';

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type Address = {
  city: string;
  geo: {
    lat: string;
    lng: string;
    street: string;
    suite: string;
    zipcode: string;
  }
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: Address;
};

const LovelyAPIURL = 'https://jsonplaceholder.typicode.com/users';

const DEFAULT_THROTTLE_MS = 800;

class LS {
  static getValue(key: string) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.log(e)
    }
  }

  static setValue<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

class API {
  constructor(public baseURL: string) {}

  async getData<T, K>(args: K): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseURL}/${args}`);

      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const LovelyAPI = new API(LovelyAPIURL);

const getRemainingTime = (lastTriggeredTime: number, throttleMs: number) => {
  const elapsedTime = Date.now() - lastTriggeredTime;
  const remainingTime = throttleMs - elapsedTime;

  return (remainingTime < 0) ? 0 : remainingTime;
};

type useThrottleProps = {
  callbackFn: <T, >(args?: T) => any
  throttleMs?: number
};

function useThrottle({
  callbackFn,
  throttleMs = DEFAULT_THROTTLE_MS,
}: useThrottleProps) {
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout|null>(null);

  return useCallback(<T, >(args?: T) => {
    let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

    if (remainingTime === 0) {
      lastTriggered.current = Date.now();
      callbackFn(args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

        if (remainingTime === 0) {
          lastTriggered.current = Date.now();
          callbackFn(args);
        }
      }, remainingTime);
    }
  }, [callbackFn, throttleMs]);
}

interface GetUserInfoButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function _GetUserInfoButton({ onClick }: GetUserInfoButtonProps): JSX.Element {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
}

const GetUserInfoButton = memo(_GetUserInfoButton);

interface IUserInfoProps {
  user: User;
}

function UserInfo({ user }: IUserInfoProps): JSX.Element {
  return (
    <table>
      <thead>
      <tr>
        <th>Username</th>
        <th>Phone number</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{user.name}</td>
        <td>{user.phone}</td>
      </tr>
      </tbody>
    </table>
  );
}

function App(): JSX.Element {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const receiveRandomUser = useCallback(async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    const userId = Math.floor(Math.random() * (10 - 1)) + 1;
    const cachedUser = LS.getValue(`${userId}`)

    if (cachedUser) {
      setUserInfo(JSON.parse(cachedUser));
    } else {
      const user = await LovelyAPI.getData<User, number>(userId);
      user && LS.setValue<User>(`${userId}`, user)

      setUserInfo(user);
    }
  }, []);

  const receiveRandomUserThrottled = useThrottle({
    callbackFn: receiveRandomUser as <T>(args?: (T | undefined)) => any,
    throttleMs: 100, // TODO: change to 1000
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

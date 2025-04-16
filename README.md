### 타입스크립트로 작성된 디스코드봇 예문!

## 0. npm 모듈 설치

`npm i --save`를 하여, 의존성 모듈을 전부 다운받습니다.

## 1. 설정 파일 변경

`src/config/bot.json`의 설정 파일을 자신에게 맞도록 변경합니다

```json
{
    "token": "",
    // 디스코드 봇 토큰
    "guildId": "",
    // 디스코드 서버 아이디 (입력하지 않으면, 슬래시 명령어가 공동으로 등록됩니다)
    "clientId": ""
    // 디스코드 봇 아이디
}
```

## 2. 봇 실행

`npm start`를 하여, 봇을 실행합니다.

<hr>

## + 명령어, 이벤트 추가 방법

### 명령어 추가

`'command/test/ping.ts`을 참고하면 알 수 있습니다!!

더 자세히 설명하자면, `'command/{category}/{commandName}.ts'`을 생성하고 `ChatCommand`를 상속 받는 클래스를 만듭니다.

```typescript
export default abstract class ChatCommand {
    abstract data: SlashCommandBuilder; // Discord.js Guide의 SlashCommandBuilder 참조
    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>; // 명령어 처리기

    public readonly isDeferReply: Boolean = true // 3초 이내 응답하지 않을 경우 오류를 뿜는데, 그걸 방지하기 위한 장치
    public readonly isEphemeral: Boolean = true // DeferReply를 활성화한 경우 작동하는 설정값. 사용한 유저한테만 보이는 명령어
}
```

### 이벤트 추가

`'event/{eventName}.ts'`을 참고하면 알 수 있습니다!!
더 자세히 설명하자면, `'event/{eventName}.ts'`을 생성하고 `Event`를 상속 받는 클래스를 만듭니다.

```typescript
export default abstract class DiscordEvent {
    abstract name: string; // 이벤트 이름, ex) 'ready', 'messageCreate' 등
    public once: Boolean = false; // 이벤트가 한번만 발생하는 경우 true로 설정

    abstract execute(...args: any[]): Promise<void>; // 이벤트 처리기
}
```

<br>

### 클라이언트 불어오기

`'index.ts'를 살펴보면 알 수 있습니다.`
```typescript
import loader from "./client/loader";
loader.client.start().then(() => console.log("Clear?"))

// loader.client는 CLIENT입니다.
```
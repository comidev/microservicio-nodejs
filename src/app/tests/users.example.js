const dotenv = require("dotenv");
dotenv.config();

const generatedUpdateBody = () => {
    return {
        username: shortUUID.generate(),
    };
};

test("forbid to get /me for anonymois", async () => {
    const response = await request(app).get(`/auth/v1/users/me`).send();
    expect(response.status).toBe(httpStatus.UNAUHORIZED);
});

describe("POST /users", () => {
    test("UNAUTHORIZED, users is anonymous", async () => {
        const response = await request(app).get(`/auth/v1/users/me`).send();
        expect(response.status).toBe(httpStatus.UNAUHORIZED);
    });

    test("BAD_REQUEST, body is not present", async () => {
        const userId = shortUUID.uuid();

        const response = await addPredefinedUserAuthentication(
            request(app).post(`/auth/v1/users/me`),
            userId,
            [UserRole.user]
        ).send({});

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    test("OK, user is role user", async () => {
        const userId = shortUUID.uuid();

        const response = await addPredefinedUserAuthentication(
            request(app).post(`/auth/v1/users/me`),
            userId,
            [UserRole.user]
        ).send(generatedUpdateBody());

        expect(response.status).toBe(httpStatus.OK);
    });
});

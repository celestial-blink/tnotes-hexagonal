export default interface ErrorInterface extends Error {
    status?: number;
    data?: any
}

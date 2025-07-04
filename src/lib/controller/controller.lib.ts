import { RequestHandler, Router } from 'express';

abstract class Controller {
  protected constructor(public router: Router) {
    this.initMiddleware();
    this.initServices();
    this.initRoutes();
  }

  abstract initMiddleware(): void;
  abstract initServices(): void;
  abstract initRoutes(): void;

  /**
   * This method sets a middleware to be used by all the routes
   * defined on a controller class. This helps avoid repetition.
   * @param middleware
   * @protected
   */
  protected setControllerMiddleware(middleware: RequestHandler) {
    this.router.use(middleware);
    return this;
  }
}
export default Controller;

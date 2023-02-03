import { Connector } from "denodb";
import { Client as PlanetScaleClient } from "@planetscale/database";
import { ConnectorOptions } from "denodb/lib/connectors/connector.ts";
import { SQLTranslator } from "denodb/lib/translators/sql-translator.ts";
import { SupportedSQLDatabaseDialect } from "denodb/lib/translators/sql-translator.ts";
import { QueryDescription } from "denodb/lib/query-builder.ts";

interface PlanetScaleOptions extends ConnectorOptions {
  url: string;
}

export class PlanetScaleConnector implements Connector {
  _dialect: SupportedSQLDatabaseDialect = "mysql";
  _options: PlanetScaleOptions;
  _translator: SQLTranslator;

  _client: PlanetScaleClient;
  _connected = false;

  constructor(options: PlanetScaleOptions) {
    this._options = options;
    this._client = new PlanetScaleClient(this._options);
    this._connected = true;
    this._translator = new SQLTranslator(this._dialect);
  }

  // TODO: implement
  async ping() {
    try {
      const [{ result }] = await this._client.execute("SELECT 1 + 1 as result");
      return result === 2;
    } catch {
      return false;
    }
  }

  async _makeConnection() {}

  async query(
    queryDescription: QueryDescription,
  ): Promise<any | any[]> {
    const query = this._translator.translateToQuery(queryDescription);
    console.log(query + "\n\n");
    const subqueries = query.split(/;(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/);

    for (let i = 0; i < subqueries.length; i++) {
      console.log(subqueries[i] + "\n\n");
      const result = await this._client.execute(subqueries[i]);
      console.log(result);

      if (i === subqueries.length - 1) {
        return result;
      }
    }
  }

  transaction(queries: () => Promise<void>) {
    return this._client.transaction(queries);
  }

  // Does nothing because the driver doesn’t allow us to disconnect.
  async close() {}
}

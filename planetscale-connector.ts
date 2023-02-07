import { Connector } from "denodb";
import { cast, Client as PlanetScaleClient } from "@planetscale/database";
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
    this._client = new PlanetScaleClient({
      cast: inflate,
      ...this._options,
    });
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
    console.log(query);
    const result = await this._client.execute(query);

    return result?.rows;
  }

  transaction(queries: () => Promise<void>) {
    return this._client.transaction(queries);
  }

  // Does nothing because the driver doesn’t allow us to disconnect.
  async close() {}
}

function inflate(field, value) {
  if (field.type === "INT64" || field.type === "UINT64") {
    return BigInt(value);
  }
  return cast(field, value);
}
